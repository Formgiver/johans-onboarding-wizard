-- Seed test data for v1 onboarding wizard
-- Run this in Supabase SQL Editor after migrations are applied

-- Note: Replace user_id values with your actual auth.users.id after login
-- You can get your user_id by running: SELECT id, email FROM auth.users;

-- First, let's create some sample data
-- IMPORTANT: Update these UUIDs with real user IDs from your auth.users table

-- Example org_id and user_id (REPLACE THESE!)
DO $$
DECLARE
  v_org_id uuid := gen_random_uuid();
  v_user_id uuid := (SELECT id FROM auth.users LIMIT 1); -- Get first user
  v_project_id uuid := gen_random_uuid();
  v_wizard_id uuid := gen_random_uuid();
  v_instance_id uuid := gen_random_uuid();
  v_step1_id uuid := gen_random_uuid();
  v_step2_id uuid := gen_random_uuid();
  v_step3_id uuid := gen_random_uuid();
  v_step4_id uuid := gen_random_uuid();
  v_step5_id uuid := gen_random_uuid();
BEGIN
  -- Insert organization
  INSERT INTO organizations (id, name, country, created_at, updated_at)
  VALUES (
    v_org_id,
    'ACME Corp',
    'SE',
    now(),
    now()
  );

  -- Insert user_org membership
  IF v_user_id IS NOT NULL THEN
    INSERT INTO user_orgs (user_id, org_id, role, created_at)
    VALUES (v_user_id, v_org_id, 'OWNER', now())
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert project
  INSERT INTO projects (id, org_id, name, status, country, created_at, updated_at)
  VALUES (
    v_project_id,
    v_org_id,
    'ACME Onboarding - January 2026',
    'ACTIVE',
    'SE',
    now(),
    now()
  );

  -- Insert wizard definition
  INSERT INTO wizards (id, org_id, key, name, description, is_active, created_at, updated_at)
  VALUES (
    v_wizard_id,
    v_org_id,
    'customer_info',
    'Customer Information Wizard',
    'Collect essential customer information for onboarding',
    true,
    now(),
    now()
  );

  -- Insert wizard steps with different types
  INSERT INTO wizard_steps (id, wizard_id, step_key, title, description, position, is_required, step_type, config, created_at, updated_at)
  VALUES
    (
      v_step1_id,
      v_wizard_id,
      'company_name',
      'Company Name',
      'Enter the legal company name',
      1,
      true,
      'text',
      '{"placeholder": "e.g., ACME Corporation AB"}',
      now(),
      now()
    ),
    (
      v_step2_id,
      v_wizard_id,
      'payment_gateway',
      'Payment Gateway',
      'Select your preferred payment gateway',
      2,
      true,
      'select',
      '{"options": [{"value": "stripe", "label": "Stripe"}, {"value": "elavon", "label": "Elavon"}, {"value": "nets", "label": "Nets"}]}',
      now(),
      now()
    ),
    (
      v_step3_id,
      v_wizard_id,
      'additional_notes',
      'Additional Notes',
      'Any special requirements or notes?',
      3,
      false,
      'textarea',
      '{"placeholder": "Enter any additional information...", "rows": 5}',
      now(),
      now()
    ),
    (
      v_step4_id,
      v_wizard_id,
      'terms_accepted',
      'Terms and Conditions',
      'Accept our terms and conditions',
      4,
      true,
      'checkbox',
      '{"label": "I confirm that I have read and accept the terms and conditions"}',
      now(),
      now()
    ),
    (
      v_step5_id,
      v_wizard_id,
      'bank_account',
      'Bank Account Number (Sweden only)',
      'Swedish clearing number and account number',
      5,
      false,
      'country_specific',
      '{"countries": ["SE"], "placeholder": "e.g., 1234-123456789"}',
      now(),
      now()
    );

  -- Insert wizard instance
  INSERT INTO wizard_instances (
    id, 
    org_id, 
    project_id, 
    wizard_id, 
    status, 
    activated_at,
    total_required_steps,
    created_at, 
    updated_at
  )
  VALUES (
    v_instance_id,
    v_org_id,
    v_project_id,
    v_wizard_id,
    'ACTIVE',
    now(),
    3, -- 3 required steps (company_name, payment_gateway, terms_accepted)
    now(),
    now()
  );

  -- Insert some sample inputs (partially completed wizard)
  INSERT INTO wizard_step_inputs (wizard_instance_id, wizard_step_id, data, created_at, updated_at)
  VALUES
    (
      v_instance_id,
      v_step1_id,
      '{"value": "ACME Corporation AB"}',
      now(),
      now()
    ),
    (
      v_instance_id,
      v_step2_id,
      '{"value": "stripe"}',
      now(),
      now()
    );

  RAISE NOTICE 'Test data created successfully!';
  RAISE NOTICE 'Organization ID: %', v_org_id;
  RAISE NOTICE 'Project ID: %', v_project_id;
  RAISE NOTICE 'Wizard Instance ID: %', v_instance_id;
  RAISE NOTICE 'Navigate to: /projects/% /wizards/%', v_project_id, v_instance_id;
END $$;
