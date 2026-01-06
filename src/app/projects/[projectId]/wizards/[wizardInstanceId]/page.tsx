import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { StatusBadge, WizardProgress } from '@/components/ui'
import WizardInputsClient from './WizardInputsClient'
// import WizardOutputsClient from './WizardOutputsClient'
// import {
//   generateCustomerSummary,
//   generatePMZendeskDraft,
// } from '@/lib/wizard-outputs'

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
      <div className="min-h-screen bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Wizard Instance</h1>
          <p className="mt-6 text-lg/8 text-gray-600">
            You must be logged in to view this wizard.
          </p>
          <div className="mt-10">
            <Link
              href="/login"
              className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { data: instance } = await supabase
    .from('wizard_instances')
    .select(`
      id,
      status,
      wizard_id,
      progress_percent,
      completed_steps_count,
      total_required_steps,
      project_id,
      wizards (
        id,
        name,
        description
      ),
      projects (
        id,
        name,
        country,
        organizations (
          id,
          name
        )
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

  const project = Array.isArray(instance.projects)
    ? null
    : (instance.projects as {
        id: string
        name: string
        country: string | null
        organizations: { id: string; name: string } | null
      } | null)

  if (!wizard) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">Error</h1>
          <div className="mt-6 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">Wizard definition not found.</p>
          </div>
        </div>
      </div>
    )
  }

  const { data: steps } = await supabase
    .from('wizard_steps')
    .select('id, step_key, title, description, position, is_required, step_type, config')
    .eq('wizard_id', wizard.id)
    .order('position', { ascending: true })

  if (!steps || steps.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href={`/projects/${projectId}/wizards`}
              className="inline-flex items-center gap-x-1.5 text-sm font-semibold text-gray-900 hover:text-indigo-600"
            >
              <ArrowLeftIcon aria-hidden="true" className="size-4" />
              Back to Wizards
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{wizard.name}</h1>
          <div className="mt-6 rounded-md bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">No steps defined for this wizard.</p>
          </div>
        </div>
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
      step_type: string
      config: Record<string, unknown>
    }) => ({
      step_id: step.id,
      step_key: step.step_key,
      title: step.title,
      description: step.description,
      position: step.position,
      is_required: step.is_required,
      step_type: step.step_type as 'text' | 'textarea' | 'select' | 'checkbox' | 'country_specific',
      config: step.config || {},
      existing_data: inputsMap[step.id] || {},
    })
  )

  // Prepare data for output generation
  // const stepsForOutput = steps.map((step) => ({
  //   step_key: step.step_key,
  //   title: step.title,
  //   description: step.description,
  //   step_type: step.step_type,
  //   position: step.position,
  //   is_required: step.is_required,
  //   input_value: (inputsMap[step.id]?.value as unknown) || null,
  // }))

  // const customerSummary = generateCustomerSummary(wizard.name, stepsForOutput)
  // const pmDraft = generatePMZendeskDraft(
  //   wizard.name,
  //   project?.name || 'Unknown Project',
  //   project?.organizations
  //     ? Array.isArray(project.organizations)
  //       ? 'Unknown Organization'
  //       : project.organizations.name
  //     : 'Unknown Organization',
  //   stepsForOutput
  // )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href={`/projects/${projectId}/wizards`}
            className="inline-flex items-center gap-x-1.5 text-sm font-semibold text-gray-900 hover:text-indigo-600"
          >
            <ArrowLeftIcon aria-hidden="true" className="size-4" />
            Back to Wizards
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Wizard Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{wizard.name}</h1>
              {wizard.description && <p className="mt-2 text-base text-gray-600">{wizard.description}</p>}
            </div>
            <StatusBadge status={instance.status as any} />
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <WizardProgress
              completedSteps={instance.completed_steps_count || 0}
              totalSteps={instance.total_required_steps || 0}
              percentage={instance.progress_percent || 0}
            />
          </div>
        </div>

        {/* Steps Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Wizard Steps</h2>
          <p className="mt-1 text-sm text-gray-600">Complete all required steps to finish the wizard.</p>
        </div>

        <WizardInputsClient
          wizardInstanceId={wizardInstanceId}
          steps={stepsWithData}
          projectCountry={project?.country || undefined}
        />

        {/* <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ccc' }} />

        <h2>Outputs & Summaries</h2>
        <WizardOutputsClient
          customerSummary={customerSummary}
          pmDraft={pmDraft}
        /> */}
      </div>
    </div>
  )
}
