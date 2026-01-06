-- Migration: Create wizard engine data model (v1)
-- Purpose: Define core tables for data-driven onboarding wizards
-- Multi-tenant: all tables include org_id for tenant isolation
-- Security: RLS enabled on all tables

-- ============================================================================
-- Table: wizards
-- Purpose: Reusable wizard definitions (e.g., "Elavon Acquirer Onboarding")
-- ============================================================================

CREATE TABLE wizards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  key text NOT NULL,
  name text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, key)
);

COMMENT ON TABLE wizards IS 'Reusable wizard definitions for onboarding workflows';
COMMENT ON COLUMN wizards.key IS 'Stable identifier (e.g., elavon_acquirer)';
COMMENT ON COLUMN wizards.org_id IS 'Tenant scope';
COMMENT ON COLUMN wizards.is_active IS 'Whether this wizard definition is available for use';

-- Enable RLS
ALTER TABLE wizards ENABLE ROW LEVEL SECURITY;

-- RLS policy: users can read wizards for their organization
CREATE POLICY "Users can read wizards in their org"
  ON wizards
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM projects
      WHERE id IN (
        SELECT project_id FROM project_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- RLS policy: authenticated users can insert wizards (admin-level operation in practice)
CREATE POLICY "Authenticated users can create wizards"
  ON wizards
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS policy: users can update wizards in their org
CREATE POLICY "Users can update wizards in their org"
  ON wizards
  FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM projects
      WHERE id IN (
        SELECT project_id FROM project_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- Table: wizard_steps
-- Purpose: Ordered steps belonging to a wizard definition
-- ============================================================================

CREATE TABLE wizard_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  wizard_id uuid NOT NULL REFERENCES wizards(id) ON DELETE CASCADE,
  step_key text NOT NULL,
  title text NOT NULL,
  description text,
  position integer NOT NULL,
  is_required boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (wizard_id, step_key),
  UNIQUE (wizard_id, position)
);

COMMENT ON TABLE wizard_steps IS 'Ordered steps within a wizard definition';
COMMENT ON COLUMN wizard_steps.step_key IS 'Stable identifier within wizard (e.g., customer_info)';
COMMENT ON COLUMN wizard_steps.position IS 'Ordering of steps (1, 2, 3, ...)';
COMMENT ON COLUMN wizard_steps.is_required IS 'Whether this step must be completed';

-- Enable RLS
ALTER TABLE wizard_steps ENABLE ROW LEVEL SECURITY;

-- RLS policy: users can read steps for wizards in their org
CREATE POLICY "Users can read wizard steps in their org"
  ON wizard_steps
  FOR SELECT
  USING (
    wizard_id IN (
      SELECT id FROM wizards
      WHERE org_id IN (
        SELECT org_id FROM projects
        WHERE id IN (
          SELECT project_id FROM project_members
          WHERE user_id = auth.uid()
        )
      )
    )
  );

-- RLS policy: authenticated users can create wizard steps
CREATE POLICY "Authenticated users can create wizard steps"
  ON wizard_steps
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS policy: users can update steps in their org
CREATE POLICY "Users can update wizard steps in their org"
  ON wizard_steps
  FOR UPDATE
  USING (
    wizard_id IN (
      SELECT id FROM wizards
      WHERE org_id IN (
        SELECT org_id FROM projects
        WHERE id IN (
          SELECT project_id FROM project_members
          WHERE user_id = auth.uid()
        )
      )
    )
  );

-- ============================================================================
-- Table: wizard_instances
-- Purpose: Activated wizard for a specific project
-- ============================================================================

CREATE TABLE wizard_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  project_id uuid NOT NULL,
  wizard_id uuid NOT NULL REFERENCES wizards(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'DRAFT',
  activated_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED'))
);

COMMENT ON TABLE wizard_instances IS 'Active wizard instances linked to projects';
COMMENT ON COLUMN wizard_instances.project_id IS 'Project this wizard instance belongs to';
COMMENT ON COLUMN wizard_instances.wizard_id IS 'Reference to wizard definition';
COMMENT ON COLUMN wizard_instances.status IS 'Lifecycle state: DRAFT, ACTIVE, COMPLETED, ARCHIVED';
COMMENT ON COLUMN wizard_instances.activated_at IS 'When the wizard was activated';
COMMENT ON COLUMN wizard_instances.completed_at IS 'When all required steps were completed';

-- Enable RLS
ALTER TABLE wizard_instances ENABLE ROW LEVEL SECURITY;

-- RLS policy: users can read instances for their projects
CREATE POLICY "Users can read wizard instances for their projects"
  ON wizard_instances
  FOR SELECT
  USING (
    project_id IN (
      SELECT project_id FROM project_members
      WHERE user_id = auth.uid()
    )
  );

-- RLS policy: users can create instances for their projects
CREATE POLICY "Users can create wizard instances for their projects"
  ON wizard_instances
  FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT project_id FROM project_members
      WHERE user_id = auth.uid()
    )
  );

-- RLS policy: users can update instances for their projects
CREATE POLICY "Users can update wizard instances for their projects"
  ON wizard_instances
  FOR UPDATE
  USING (
    project_id IN (
      SELECT project_id FROM project_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- Table: wizard_step_inputs
-- Purpose: User-provided input data per wizard step
-- ============================================================================

CREATE TABLE wizard_step_inputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  wizard_instance_id uuid NOT NULL REFERENCES wizard_instances(id) ON DELETE CASCADE,
  wizard_step_id uuid NOT NULL REFERENCES wizard_steps(id) ON DELETE RESTRICT,
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (wizard_instance_id, wizard_step_id)
);

COMMENT ON TABLE wizard_step_inputs IS 'User input data for wizard steps';
COMMENT ON COLUMN wizard_step_inputs.data IS 'User-provided answers stored as JSONB';
COMMENT ON COLUMN wizard_step_inputs.wizard_instance_id IS 'Which wizard instance this input belongs to';
COMMENT ON COLUMN wizard_step_inputs.wizard_step_id IS 'Which step definition this input corresponds to';

-- Enable RLS
ALTER TABLE wizard_step_inputs ENABLE ROW LEVEL SECURITY;

-- RLS policy: users can read inputs for their wizard instances
CREATE POLICY "Users can read wizard step inputs for their instances"
  ON wizard_step_inputs
  FOR SELECT
  USING (
    wizard_instance_id IN (
      SELECT id FROM wizard_instances
      WHERE project_id IN (
        SELECT project_id FROM project_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- RLS policy: users can insert inputs for their wizard instances
CREATE POLICY "Users can insert wizard step inputs for their instances"
  ON wizard_step_inputs
  FOR INSERT
  WITH CHECK (
    wizard_instance_id IN (
      SELECT id FROM wizard_instances
      WHERE project_id IN (
        SELECT project_id FROM project_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- RLS policy: users can update inputs for their wizard instances
CREATE POLICY "Users can update wizard step inputs for their instances"
  ON wizard_step_inputs
  FOR UPDATE
  USING (
    wizard_instance_id IN (
      SELECT id FROM wizard_instances
      WHERE project_id IN (
        SELECT project_id FROM project_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- Indexes for performance
-- ============================================================================

CREATE INDEX idx_wizards_org_id ON wizards(org_id);
CREATE INDEX idx_wizard_steps_wizard_id ON wizard_steps(wizard_id);
CREATE INDEX idx_wizard_instances_project_id ON wizard_instances(project_id);
CREATE INDEX idx_wizard_instances_wizard_id ON wizard_instances(wizard_id);
CREATE INDEX idx_wizard_step_inputs_instance_id ON wizard_step_inputs(wizard_instance_id);
CREATE INDEX idx_wizard_step_inputs_step_id ON wizard_step_inputs(wizard_step_id);
