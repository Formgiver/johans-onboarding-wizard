-- Migration: Create sales handover data model (v1)
-- Purpose: Define tables for capturing sales selections that drive wizard activation
-- Multi-tenant: all tables include org_id for tenant isolation
-- Security: RLS enabled on all tables

-- ============================================================================
-- Table: sales_handovers
-- Purpose: One per project - represents the sales → onboarding handover snapshot
-- ============================================================================

CREATE TABLE sales_handovers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  project_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'DRAFT',
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('DRAFT', 'CONFIRMED', 'ARCHIVED')),
  UNIQUE (project_id)
);

COMMENT ON TABLE sales_handovers IS 'Sales handover snapshot per project';
COMMENT ON COLUMN sales_handovers.project_id IS 'Project this handover belongs to';
COMMENT ON COLUMN sales_handovers.status IS 'Lifecycle state: DRAFT, CONFIRMED, ARCHIVED';
COMMENT ON COLUMN sales_handovers.confirmed_at IS 'When Sales confirmed the handover';

-- Enable RLS
ALTER TABLE sales_handovers ENABLE ROW LEVEL SECURITY;

-- RLS policy: users can read handovers for their projects
CREATE POLICY "Users can read sales handovers for their projects"
  ON sales_handovers
  FOR SELECT
  USING (
    project_id IN (
      SELECT project_id FROM project_members
      WHERE user_id = auth.uid()
    )
  );

-- RLS policy: users can create handovers for their projects
CREATE POLICY "Users can create sales handovers for their projects"
  ON sales_handovers
  FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT project_id FROM project_members
      WHERE user_id = auth.uid()
    )
  );

-- RLS policy: users can update handovers for their projects
CREATE POLICY "Users can update sales handovers for their projects"
  ON sales_handovers
  FOR UPDATE
  USING (
    project_id IN (
      SELECT project_id FROM project_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- Table: sales_handover_items
-- Purpose: Individual selections made by Sales (e.g., acquirer = elavon)
-- ============================================================================

CREATE TABLE sales_handover_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  sales_handover_id uuid NOT NULL REFERENCES sales_handovers(id) ON DELETE CASCADE,
  item_key text NOT NULL,
  item_value text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (sales_handover_id, item_key)
);

COMMENT ON TABLE sales_handover_items IS 'Individual sales selections (key-value pairs)';
COMMENT ON COLUMN sales_handover_items.item_key IS 'Stable identifier (e.g., acquirer, payment_gateway)';
COMMENT ON COLUMN sales_handover_items.item_value IS 'Selected value (e.g., elavon, stripe)';
COMMENT ON COLUMN sales_handover_items.notes IS 'Optional context or clarification';

-- Enable RLS
ALTER TABLE sales_handover_items ENABLE ROW LEVEL SECURITY;

-- RLS policy: users can read items for their handovers
CREATE POLICY "Users can read sales handover items for their handovers"
  ON sales_handover_items
  FOR SELECT
  USING (
    sales_handover_id IN (
      SELECT id FROM sales_handovers
      WHERE project_id IN (
        SELECT project_id FROM project_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- RLS policy: users can insert items for their handovers
CREATE POLICY "Users can insert sales handover items for their handovers"
  ON sales_handover_items
  FOR INSERT
  WITH CHECK (
    sales_handover_id IN (
      SELECT id FROM sales_handovers
      WHERE project_id IN (
        SELECT project_id FROM project_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- RLS policy: users can update items for their handovers
CREATE POLICY "Users can update sales handover items for their handovers"
  ON sales_handover_items
  FOR UPDATE
  USING (
    sales_handover_id IN (
      SELECT id FROM sales_handovers
      WHERE project_id IN (
        SELECT project_id FROM project_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- RLS policy: users can delete items for their handovers
CREATE POLICY "Users can delete sales handover items for their handovers"
  ON sales_handover_items
  FOR DELETE
  USING (
    sales_handover_id IN (
      SELECT id FROM sales_handovers
      WHERE project_id IN (
        SELECT project_id FROM project_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- Table: sales_handover_wizard_map
-- Purpose: Declarative mapping between sales selections and wizards
-- ============================================================================

CREATE TABLE sales_handover_wizard_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  item_key text NOT NULL,
  item_value text NOT NULL,
  wizard_key text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, item_key, item_value, wizard_key)
);

COMMENT ON TABLE sales_handover_wizard_map IS 'Maps sales selections to wizards that should be activated';
COMMENT ON COLUMN sales_handover_wizard_map.item_key IS 'Sales item key (e.g., acquirer)';
COMMENT ON COLUMN sales_handover_wizard_map.item_value IS 'Sales item value (e.g., elavon)';
COMMENT ON COLUMN sales_handover_wizard_map.wizard_key IS 'Wizard key to activate (must match wizards.key)';
COMMENT ON COLUMN sales_handover_wizard_map.is_active IS 'Whether this mapping is currently active';

-- Enable RLS
ALTER TABLE sales_handover_wizard_map ENABLE ROW LEVEL SECURITY;

-- RLS policy: users can read wizard maps for their org
CREATE POLICY "Users can read wizard maps for their org"
  ON sales_handover_wizard_map
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

-- RLS policy: authenticated users can create wizard maps
CREATE POLICY "Authenticated users can create wizard maps"
  ON sales_handover_wizard_map
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS policy: users can update wizard maps for their org
CREATE POLICY "Users can update wizard maps for their org"
  ON sales_handover_wizard_map
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
-- Indexes for performance
-- ============================================================================

CREATE INDEX idx_sales_handovers_project_id ON sales_handovers(project_id);
CREATE INDEX idx_sales_handover_items_handover_id ON sales_handover_items(sales_handover_id);
CREATE INDEX idx_sales_handover_wizard_map_org_id ON sales_handover_wizard_map(org_id);
CREATE INDEX idx_sales_handover_wizard_map_lookup ON sales_handover_wizard_map(item_key, item_value) WHERE is_active = true;
