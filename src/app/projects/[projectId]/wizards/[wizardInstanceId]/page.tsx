import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import WizardInputsClient from './WizardInputsClient'

export default async function WizardInstancePage({
  params,
}: {
  params: Promise<{ projectId: string; wizardInstanceId: string }>
}) {
  const { projectId, wizardInstanceId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div style={{ maxWidth: '900px', margin: '100px auto', padding: '20px' }}>
        <h1>Wizard Instance</h1>
        <p>You must be logged in to view this wizard.</p>
        <Link href="/login" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          Go to login
        </Link>
      </div>
    )
  }

  const { data: instance } = await supabase
    .from('wizard_instances')
    .select(`
      id,
      status,
      wizard_id,
      wizards (
        id,
        name,
        description
      )
    `)
    .eq('id', wizardInstanceId)
    .eq('project_id', projectId)
    .single()

  if (!instance) {
    notFound()
  }

  const wizard = Array.isArray(instance.wizards)
    ? null
    : (instance.wizards as { id: string; name: string; description: string | null } | null)

  if (!wizard) {
    return (
      <div style={{ maxWidth: '900px', margin: '100px auto', padding: '20px' }}>
        <h1>Error</h1>
        <p>Wizard definition not found.</p>
      </div>
    )
  }

  const { data: steps } = await supabase
    .from('wizard_steps')
    .select('id, step_key, title, description, position, is_required')
    .eq('wizard_id', wizard.id)
    .order('position', { ascending: true })

  if (!steps || steps.length === 0) {
    return (
      <div style={{ maxWidth: '900px', margin: '100px auto', padding: '20px' }}>
        <Link
          href={`/projects/${projectId}/wizards`}
          style={{ color: '#0070f3', textDecoration: 'underline' }}
        >
          ← Back to Wizards
        </Link>
        <h1 style={{ marginTop: '20px' }}>{wizard.name}</h1>
        <p>No steps defined for this wizard.</p>
      </div>
    )
  }

  const { data: existingInputs } = await supabase
    .from('wizard_step_inputs')
    .select('wizard_step_id, data')
    .eq('wizard_instance_id', wizardInstanceId)

  const inputsMap = (existingInputs || []).reduce(
    (acc: Record<string, Record<string, unknown>>, input: { wizard_step_id: string; data: unknown }) => {
      acc[input.wizard_step_id] = input.data as Record<string, unknown>
      return acc
    },
    {} as Record<string, Record<string, unknown>>
  )

  const stepsWithData = steps.map(
    (step: {
      id: string
      step_key: string
      title: string
      description: string | null
      position: number
      is_required: boolean
    }) => ({
      step_id: step.id,
      step_key: step.step_key,
      title: step.title,
      description: step.description,
      position: step.position,
      is_required: step.is_required,
      existing_data: inputsMap[step.id] || {},
    })
  )

  return (
    <div style={{ maxWidth: '900px', margin: '100px auto', padding: '20px' }}>
      <Link
        href={`/projects/${projectId}/wizards`}
        style={{ color: '#0070f3', textDecoration: 'underline' }}
      >
        ← Back to Wizards
      </Link>
      <h1 style={{ marginTop: '20px' }}>{wizard.name}</h1>
      {wizard.description && <p style={{ color: '#666' }}>{wizard.description}</p>}
      <p style={{ marginTop: '12px', color: '#666' }}>
        Status: <strong>{instance.status}</strong>
      </p>

      <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ccc' }} />

      <h2>Steps</h2>
      <WizardInputsClient
        wizardInstanceId={wizardInstanceId}
        steps={stepsWithData}
      />
    </div>
  )
}
