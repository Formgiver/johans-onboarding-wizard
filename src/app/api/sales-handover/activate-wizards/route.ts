import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/sales-handover/activate-wizards
 * 
 * Creates wizard instances based on confirmed sales handover
 * 
 * Request body:
 * {
 *   "sales_handover_id": "uuid"
 * }
 * 
 * Logic:
 * - Verifies handover is confirmed
 * - Reads sales_handover_items
 * - Looks up wizards via sales_handover_wizard_map
 * - Creates wizard_instances (idempotent - skips if already exists)
 * - Uses RLS (ANON key), no service role
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Verify user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { sales_handover_id: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { sales_handover_id } = body

  if (!sales_handover_id) {
    return NextResponse.json(
      { error: 'Missing sales_handover_id' },
      { status: 400 }
    )
  }

  // Fetch the sales handover and verify it's confirmed
  const { data: handover, error: handoverError } = await supabase
    .from('sales_handovers')
    .select('id, org_id, project_id, status, confirmed_at')
    .eq('id', sales_handover_id)
    .single()

  if (handoverError || !handover) {
    return NextResponse.json(
      { error: 'Sales handover not found' },
      { status: 404 }
    )
  }

  if (handover.status !== 'CONFIRMED') {
    return NextResponse.json(
      { error: 'Sales handover must be confirmed before activating wizards' },
      { status: 400 }
    )
  }

  // Fetch sales handover items
  const { data: items, error: itemsError } = await supabase
    .from('sales_handover_items')
    .select('item_key, item_value')
    .eq('sales_handover_id', sales_handover_id)

  if (itemsError) {
    return NextResponse.json(
      { error: 'Failed to fetch handover items' },
      { status: 500 }
    )
  }

  if (!items || items.length === 0) {
    return NextResponse.json(
      { message: 'No items found in handover, no wizards activated' },
      { status: 200 }
    )
  }

  // Build array of (item_key, item_value) pairs for lookup
  const itemPairs = items.map((item) => ({
    item_key: item.item_key,
    item_value: item.item_value,
  }))

  // Fetch wizard mappings for these items
  const { data: mappings, error: mappingsError } = await supabase
    .from('sales_handover_wizard_map')
    .select('item_key, item_value, wizard_key')
    .eq('org_id', handover.org_id)
    .eq('is_active', true)

  if (mappingsError) {
    return NextResponse.json(
      { error: 'Failed to fetch wizard mappings' },
      { status: 500 }
    )
  }

  if (!mappings || mappings.length === 0) {
    return NextResponse.json(
      { message: 'No wizard mappings found, no wizards activated' },
      { status: 200 }
    )
  }

  // Determine which wizards should be activated
  const wizardKeysToActivate = new Set<string>()

  for (const item of itemPairs) {
    for (const mapping of mappings) {
      if (
        mapping.item_key === item.item_key &&
        mapping.item_value === item.item_value
      ) {
        wizardKeysToActivate.add(mapping.wizard_key)
      }
    }
  }

  if (wizardKeysToActivate.size === 0) {
    return NextResponse.json(
      { message: 'No matching wizards found for handover items' },
      { status: 200 }
    )
  }

  // Fetch wizard definitions by keys
  const { data: wizards, error: wizardsError } = await supabase
    .from('wizards')
    .select('id, key, name')
    .eq('org_id', handover.org_id)
    .eq('is_active', true)
    .in('key', Array.from(wizardKeysToActivate))

  if (wizardsError) {
    return NextResponse.json(
      { error: 'Failed to fetch wizard definitions' },
      { status: 500 }
    )
  }

  if (!wizards || wizards.length === 0) {
    return NextResponse.json(
      { error: 'No active wizards found matching the handover items' },
      { status: 404 }
    )
  }

  // Check which wizard instances already exist (idempotent behavior)
  const { data: existingInstances } = await supabase
    .from('wizard_instances')
    .select('wizard_id')
    .eq('project_id', handover.project_id)

  const existingWizardIds = new Set(
    (existingInstances || []).map((inst) => inst.wizard_id)
  )

  // Create wizard instances for wizards that don't already have instances
  const instancesToCreate = wizards
    .filter((wizard) => !existingWizardIds.has(wizard.id))
    .map((wizard) => ({
      org_id: handover.org_id,
      project_id: handover.project_id,
      wizard_id: wizard.id,
      status: 'ACTIVE',
      activated_at: new Date().toISOString(),
    }))

  if (instancesToCreate.length === 0) {
    return NextResponse.json(
      {
        message: 'All required wizards already activated',
        activated_count: 0,
        wizard_count: wizards.length,
      },
      { status: 200 }
    )
  }

  // Insert wizard instances
  const { data: createdInstances, error: createError } = await supabase
    .from('wizard_instances')
    .insert(instancesToCreate)
    .select()

  if (createError) {
    return NextResponse.json(
      { error: 'Failed to create wizard instances', details: createError.message },
      { status: 500 }
    )
  }

  // After creating instances, initialize their total_required_steps
  // This is necessary for progress tracking
  if (createdInstances && createdInstances.length > 0) {
    for (const instance of createdInstances) {
      // Count required steps for this wizard
      const { data: stepCount } = await supabase
        .from('wizard_steps')
        .select('id', { count: 'exact', head: true })
        .eq('wizard_id', instance.wizard_id)
        .eq('is_required', true)

      // Update the instance with total_required_steps
      await supabase
        .from('wizard_instances')
        .update({
          total_required_steps: stepCount || 0,
        })
        .eq('id', instance.id)
    }
  }

  return NextResponse.json(
    {
      message: 'Wizard instances activated successfully',
      activated_count: createdInstances?.length || 0,
      wizard_instances: createdInstances,
    },
    { status: 201 }
  )
}
