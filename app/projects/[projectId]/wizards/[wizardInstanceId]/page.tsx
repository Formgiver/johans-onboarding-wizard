import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { 
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import { AppShell } from '@/components/layout'
import { StatusBadge } from '@/components/ui'
import type { WizardStatus } from '@/components/ui'
import WizardInputsClient from './WizardInputsClient'

/**
 * Wizard Instance Page
 * 
 * Design principles:
 * - Clear step structure with visual progress
 * - Step status visible at a glance
 * - Obvious "what do I do now?"
 * - Zero ambiguity for customers
 */

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
    redirect('/login')
  }

  // Fetch wizard instance with related data
  const { data: instance } = await supabase
    .from('wizard_instances')
    .select(`
      id,
      status,
      wizard_id,
      progress_percentage,
      completed_steps_count,
      total_required_steps,
      project_id,
      started_at,
      completed_at,
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
      <AppShell
        user={{ email: user.email ?? '' }}
        breadcrumbs={[
          { name: 'Projects', href: '/projects' },
          { name: 'Wizard' },
        ]}
      >
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-800">Wizard definition not found.</p>
        </div>
      </AppShell>
    )
  }

  // Fetch wizard steps
  const { data: steps } = await supabase
    .from('wizard_steps')
    .select('id, step_key, title, description, position, is_required, step_type, config')
    .eq('wizard_id', wizard.id)
    .order('position', { ascending: true })

  // Fetch existing inputs
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

  const stepsWithData = (steps ?? []).map(
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

  // Calculate progress stats
  const totalSteps = stepsWithData.length
  const requiredSteps = stepsWithData.filter(s => s.is_required).length
  const completedSteps = instance.completed_steps_count ?? 0
  const progress = instance.progress_percentage ?? 0
  const isCompleted = instance.status === 'completed'

  return (
    <AppShell
      user={{ email: user.email ?? '' }}
      breadcrumbs={[
        { name: 'Projects', href: '/projects' },
        { name: project?.name ?? 'Project', href: `/projects/${projectId}` },
        { name: 'Wizards', href: `/projects/${projectId}/wizards` },
        { name: wizard.name },
      ]}
    >
      {/* Wizard Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-x-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{wizard.name}</h1>
            {wizard.description && (
              <p className="mt-1 text-sm text-gray-500">{wizard.description}</p>
            )}
          </div>
          <StatusBadge status={instance.status as WizardStatus} size="md" />
        </div>

        {/* Progress summary */}
        <div className="mt-6 rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Progress</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{progress}%</p>
              </div>
              <div className="h-10 w-px bg-gray-200" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-gray-500">Steps completed</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{completedSteps} / {requiredSteps}</p>
              </div>
            </div>
            {isCompleted ? (
              <div className="flex items-center gap-x-2 text-green-600">
                <CheckCircleIcon className="size-5" aria-hidden="true" />
                <span className="text-sm font-medium">All requirements met</span>
              </div>
            ) : (
              <div className="flex items-center gap-x-2 text-amber-600">
                <ExclamationCircleIcon className="size-5" aria-hidden="true" />
                <span className="text-sm font-medium">{requiredSteps - completedSteps} steps remaining</span>
              </div>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted ? 'bg-green-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      {totalSteps > 0 ? (
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Steps</h2>
            <p className="text-sm text-gray-500">
              Complete each step below. Required steps are marked with an asterisk.
            </p>
          </div>

          <WizardInputsClient
            wizardInstanceId={wizardInstanceId}
            steps={stepsWithData}
            projectCountry={project?.country || undefined}
          />
        </div>
      ) : (
        <div className="rounded-lg bg-amber-50 p-4">
          <p className="text-sm text-amber-800">No steps have been configured for this wizard yet.</p>
        </div>
      )}
    </AppShell>
  )
}
