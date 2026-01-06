# Quick Start Guide

## Prerequisites
- Supabase project set up
- Logged in with a user account

## Setup Steps

### 1. Run Migrations
In Supabase SQL Editor, run migrations in order:
```sql
-- First run the base migrations (if not already done)
-- Then run the v1 migration:
supabase/migrations/20260106000003_add_step_types_and_progress.sql
```

### 2. Create Test Data
In Supabase SQL Editor, run:
```sql
supabase/seed-test-data.sql
```

This will create:
- An organization (ACME Corp)
- A project (ACME Onboarding)
- A wizard definition with 5 different step types
- A wizard instance with some sample data

### 3. Navigate the Application

**Home Page:** `/`
- Shows overview and navigation links

**Projects Page:** `/projects`
- Lists all your projects
- Click "View Wizards →" to see wizards for a project

**Wizard Instances:** `/projects/{projectId}/wizards`
- Shows all wizard instances for the project

**Wizard Instance Detail:** `/projects/{projectId}/wizards/{wizardInstanceId}`
- Complete wizard steps
- See progress tracking
- View generated outputs (when un-commented)

## Features You Can Test

### 1. Structured Step Types
The test wizard includes 5 different input types:
- **Text**: Company Name (single-line input)
- **Select**: Payment Gateway (dropdown)
- **Textarea**: Additional Notes (multi-line)
- **Checkbox**: Terms Acceptance (boolean)
- **Country-specific**: Bank Account (only for Sweden)

### 2. Progress Tracking
- Complete required steps and watch progress update automatically
- Progress shown as percentage and count (e.g., "75% (3/4 steps)")
- Status auto-transitions: DRAFT → ACTIVE → COMPLETED

### 3. Country-Specific Fields
- Bank Account field only shows for Swedish projects
- Test by changing project country in database

### 4. Automatic Wizard Activation
POST to `/api/sales-handover/activate-wizards` with:
```json
{
  "sales_handover_id": "uuid"
}
```

### 5. Output Generation (Currently Commented Out)
- Customer Summary: Markdown-formatted customer confirmation
- PM/Zendesk Draft: Structured handover text
- To enable: uncomment lines in `page.tsx`

## Troubleshooting

### "No projects found"
- Run `seed-test-data.sql`
- Verify you're logged in with the correct user
- Check `user_orgs` table for membership

### "No steps defined for this wizard"
- Verify wizard_steps were created
- Check `wizard_steps.wizard_id` matches `wizard_instances.wizard_id`

### Country-specific field not showing
- Check project.country matches step config.countries
- Example: Project must have country='SE' to see Swedish bank field

### Progress not updating
- Check database trigger is created: `after_wizard_step_input_change`
- Verify function exists: `update_wizard_instance_progress()`
- Try manually calling: `SELECT update_wizard_instance_progress('instance_id');`

## Database Queries for Debugging

### Get your user ID
```sql
SELECT id, email FROM auth.users;
```

### See all your projects
```sql
SELECT p.* 
FROM projects p
JOIN user_orgs uo ON p.org_id = uo.org_id
WHERE uo.user_id = 'your-user-id';
```

### See wizard instances for a project
```sql
SELECT wi.*, w.name as wizard_name
FROM wizard_instances wi
JOIN wizards w ON wi.wizard_id = w.id
WHERE wi.project_id = 'project-id';
```

### Check progress calculation
```sql
SELECT 
  wi.id,
  wi.progress_percent,
  wi.completed_steps_count,
  wi.total_required_steps,
  wi.status
FROM wizard_instances wi
WHERE wi.id = 'instance-id';
```

## Next Steps

1. **Test the UI**: Navigate through projects → wizards → instance
2. **Complete steps**: Fill out forms and watch progress update
3. **Try different step types**: Test text, select, checkbox, etc.
4. **Sales handover**: Create a sales handover and test auto-activation
5. **Enable outputs**: Uncomment WizardOutputsClient when module issue is resolved

## Known Issues

- WizardOutputsClient is currently commented out due to module resolution issue
- Outputs functionality implemented but not visible in UI
- Workaround: Use library functions directly or wait for fix
