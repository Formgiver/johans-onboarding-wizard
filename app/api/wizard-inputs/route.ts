import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    wizard_instance_id: string
    wizard_step_id: string
    data: Record<string, unknown>
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { wizard_instance_id, wizard_step_id, data } = body

  if (!wizard_instance_id || !wizard_step_id || typeof data !== 'object') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: instance } = await supabase
    .from('wizard_instances')
    .select('id, org_id')
    .eq('id', wizard_instance_id)
    .single()

  if (!instance) {
    return NextResponse.json({ error: 'Wizard instance not found' }, { status: 404 })
  }

  const { data: existingInput } = await supabase
    .from('wizard_step_inputs')
    .select('id')
    .eq('wizard_instance_id', wizard_instance_id)
    .eq('wizard_step_id', wizard_step_id)
    .single()

  let result

  if (existingInput) {
    result = await supabase
      .from('wizard_step_inputs')
      .update({
        data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingInput.id)
      .select()
  } else {
    result = await supabase
      .from('wizard_step_inputs')
      .insert({
        org_id: instance.org_id,
        wizard_instance_id,
        wizard_step_id,
        data,
      })
      .select()
  }

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data: result.data })
}
