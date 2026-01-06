-- Migration: Add structured step types and progress tracking
-- Purpose: Support typed wizard steps and wizard instance progress tracking
-- Related to: Feature request for structured inputs and progress model

-- ============================================================================
-- Add step_type and config to wizard_steps
-- ============================================================================

-- Add step_type column with default 'text' for backward compatibility
ALTER TABLE wizard_steps
  ADD COLUMN step_type text NOT NULL DEFAULT 'text';

-- Add config column for storing type-specific configuration (e.g., select options)
ALTER TABLE wizard_steps
  ADD COLUMN config jsonb NOT NULL DEFAULT '{}';

-- Add validation_rules column for future extensibility
ALTER TABLE wizard_steps
  ADD COLUMN validation_rules jsonb NOT NULL DEFAULT '{}';

COMMENT ON COLUMN wizard_steps.step_type IS 'Input type: text, textarea, select, checkbox, country_specific';
COMMENT ON COLUMN wizard_steps.config IS 'Type-specific configuration (e.g., options for select, country codes for country_specific)';
COMMENT ON COLUMN wizard_steps.validation_rules IS 'Validation rules for the step (e.g., min/max length, regex patterns)';

-- Add constraint to ensure valid step types
ALTER TABLE wizard_steps
  ADD CONSTRAINT valid_step_type 
  CHECK (step_type IN ('text', 'textarea', 'select', 'checkbox', 'country_specific'));

-- ============================================================================
-- Update wizard_instances status and add progress tracking
-- ============================================================================

-- Drop old status constraint
ALTER TABLE wizard_instances
  DROP CONSTRAINT valid_status;

-- Add new status constraint with WAITING_ON_CUSTOMER
ALTER TABLE wizard_instances
  ADD CONSTRAINT valid_status 
  CHECK (status IN ('DRAFT', 'ACTIVE', 'WAITING_ON_CUSTOMER', 'COMPLETED', 'ARCHIVED'));

-- Add progress column (0-100 percentage)
ALTER TABLE wizard_instances
  ADD COLUMN progress_percent integer NOT NULL DEFAULT 0;

-- Add completed steps count for quick reference
ALTER TABLE wizard_instances
  ADD COLUMN completed_steps_count integer NOT NULL DEFAULT 0;

-- Add total required steps count for quick reference
ALTER TABLE wizard_instances
  ADD COLUMN total_required_steps integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN wizard_instances.progress_percent IS 'Completion percentage (0-100) based on required steps';
COMMENT ON COLUMN wizard_instances.completed_steps_count IS 'Number of required steps that have been completed';
COMMENT ON COLUMN wizard_instances.total_required_steps IS 'Total number of required steps in the wizard';

-- Add constraint to ensure valid progress values
ALTER TABLE wizard_instances
  ADD CONSTRAINT valid_progress 
  CHECK (progress_percent >= 0 AND progress_percent <= 100);

-- ============================================================================
-- Create function to calculate and update wizard progress
-- ============================================================================

CREATE OR REPLACE FUNCTION update_wizard_instance_progress(instance_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_required integer;
  v_completed integer;
  v_progress integer;
  v_new_status text;
  v_current_status text;
BEGIN
  -- Get total required steps for this wizard instance
  SELECT COUNT(*)
  INTO v_total_required
  FROM wizard_steps ws
  INNER JOIN wizard_instances wi ON wi.wizard_id = ws.wizard_id
  WHERE wi.id = instance_id
    AND ws.is_required = true;

  -- Get completed required steps (steps with non-empty data)
  SELECT COUNT(*)
  INTO v_completed
  FROM wizard_steps ws
  INNER JOIN wizard_instances wi ON wi.wizard_id = ws.wizard_id
  LEFT JOIN wizard_step_inputs wsi ON wsi.wizard_step_id = ws.id 
    AND wsi.wizard_instance_id = wi.id
  WHERE wi.id = instance_id
    AND ws.is_required = true
    AND wsi.data IS NOT NULL
    AND wsi.data != '{}'::jsonb;

  -- Calculate progress percentage
  IF v_total_required > 0 THEN
    v_progress := (v_completed * 100) / v_total_required;
  ELSE
    v_progress := 100;
  END IF;

  -- Get current status
  SELECT status INTO v_current_status
  FROM wizard_instances
  WHERE id = instance_id;

  -- Determine new status based on progress
  IF v_progress = 100 AND v_current_status != 'COMPLETED' AND v_current_status != 'ARCHIVED' THEN
    v_new_status := 'COMPLETED';
  ELSIF v_progress > 0 AND v_progress < 100 AND v_current_status = 'DRAFT' THEN
    v_new_status := 'ACTIVE';
  ELSE
    v_new_status := v_current_status;
  END IF;

  -- Update wizard instance
  UPDATE wizard_instances
  SET 
    progress_percent = v_progress,
    completed_steps_count = v_completed,
    total_required_steps = v_total_required,
    status = v_new_status,
    completed_at = CASE 
      WHEN v_new_status = 'COMPLETED' AND v_current_status != 'COMPLETED' THEN now()
      ELSE completed_at
    END,
    updated_at = now()
  WHERE id = instance_id;
END;
$$;

COMMENT ON FUNCTION update_wizard_instance_progress IS 'Calculates and updates wizard instance progress based on completed required steps';

-- ============================================================================
-- Create trigger to auto-update progress when step inputs change
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_update_wizard_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update progress for the affected wizard instance
  PERFORM update_wizard_instance_progress(
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.wizard_instance_id
      ELSE NEW.wizard_instance_id
    END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER after_wizard_step_input_change
  AFTER INSERT OR UPDATE OR DELETE ON wizard_step_inputs
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_wizard_progress();

COMMENT ON TRIGGER after_wizard_step_input_change ON wizard_step_inputs IS 'Automatically updates wizard progress when step inputs change';

-- ============================================================================
-- Initialize progress for existing wizard instances
-- ============================================================================

-- Update total_required_steps for all existing instances
UPDATE wizard_instances wi
SET total_required_steps = (
  SELECT COUNT(*)
  FROM wizard_steps ws
  WHERE ws.wizard_id = wi.wizard_id
    AND ws.is_required = true
);

-- Calculate initial progress for all existing instances
DO $$
DECLARE
  instance_record RECORD;
BEGIN
  FOR instance_record IN SELECT id FROM wizard_instances LOOP
    PERFORM update_wizard_instance_progress(instance_record.id);
  END LOOP;
END $$;
