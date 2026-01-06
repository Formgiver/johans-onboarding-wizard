import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { 
  ChevronRightIcon, 
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { AppShell } from '@/components/layout'
import { StatusBadge, ProgressRing } from '@/components/ui'
import type { WizardStatus } from '@/components/ui'

/**
 * Project Detail Page (Hub)
 * 
 * Design principles:
 * - Acts as the hub for a project
 * - Shows overall progress prominently
 * - Lists active wizards with status
 * - Highlights next recommended action
 */

type WizardInstanceRaw = {
  id: string
  status: string
  progress_percentage: number | null
  started_at: string | null
  completed_at: string | null
  wizards: {
    id: string
    name: string
    description: string | null
  } | null
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch project with wizard instances
  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      status,
      created_at,
      wizard_instances (
        id,
        status,
        progress_percentage,
        started_at,
        completed_at,
        wizards (
          id,
          name,
          description
        )
      )
    `)
    .eq('id', projectId)
    .single()

  if (error || !project) {
    notFound()
  }

  // Handle the Supabase return type (could be array due to join)
  const rawWizards = project.wizard_instances ?? []
  const wizards: WizardInstanceRaw[] = rawWizards.map((w: Record<string, unknown>) => ({
    id: w.id as string,
    status: w.status as string,
    progress_percentage: w.progress_percentage as number | null,
    started_at: w.started_at as string | null,
    completed_at: w.completed_at as string | null,
    wizards: Array.isArray(w.wizards) ? w.wizards[0] : w.wizards as WizardInstanceRaw['wizards'],
  }))
  
  const totalWizards = wizards.length
  const completedWizards = wizards.filter((w) => w.status === 'completed').length
  const inProgressWizards = wizards.filter((w) => w.status === 'in_progress')
  const blockedWizards = wizards.filter((w) => w.status === 'blocked')
  const pendingWizards = wizards.filter((w) => w.status === 'not_started')
  
  // Calculate overall progress
  const overallProgress = totalWizards > 0
    ? Math.round(wizards.reduce((sum, w) => sum + (w.progress_percentage ?? 0), 0) / totalWizards)
    : 0

  // Determine next action
  const nextAction = blockedWizards.length > 0
    ? { type: 'blocked', wizard: blockedWizards[0] }
    : inProgressWizards.length > 0
      ? { type: 'continue', wizard: inProgressWizards[0] }
      : pendingWizards.length > 0
        ? { type: 'start', wizard: pendingWizards[0] }
        : null

  return (
    <AppShell
      user={{ email: user.email ?? '' }}
      breadcrumbs={[
        { name: 'Projects', href: '/projects' },
        { name: project.name },
      ]}
    >
      {/* Project Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <div className="mt-2 flex items-center gap-x-4">
              <StatusBadge status={project.status as WizardStatus} size="md" />
              <span className="text-sm text-gray-500">
                Created {new Date(project.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <ProgressRing progress={overallProgress} size="lg" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
          <p className="text-sm font-medium text-gray-500">Total Wizards</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{totalWizards}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
          <p className="text-sm font-medium text-gray-500">Completed</p>
          <p className="mt-1 text-2xl font-semibold text-green-600">{completedWizards}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
          <p className="text-sm font-medium text-gray-500">In Progress</p>
          <p className="mt-1 text-2xl font-semibold text-blue-600">{inProgressWizards.length}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
          <p className="text-sm font-medium text-gray-500">Blocked</p>
          <p className="mt-1 text-2xl font-semibold text-amber-600">{blockedWizards.length}</p>
        </div>
      </div>

      {/* Next Action Card */}
      {nextAction && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-medium text-gray-900">Recommended Next Action</h2>
          <Link
            href={`/projects/${projectId}/wizards/${nextAction.wizard.id}`}
            className="group flex items-center gap-x-4 rounded-lg bg-indigo-50 p-4 ring-1 ring-indigo-100 transition hover:bg-indigo-100"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
              {nextAction.type === 'blocked' ? (
                <ExclamationTriangleIcon className="size-5 text-white" aria-hidden="true" />
              ) : nextAction.type === 'continue' ? (
                <ClockIcon className="size-5 text-white" aria-hidden="true" />
              ) : (
                <ClipboardDocumentListIcon className="size-5 text-white" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-indigo-900">
                {nextAction.type === 'blocked' 
                  ? 'Resolve blocked wizard'
                  : nextAction.type === 'continue'
                    ? 'Continue in-progress wizard'
                    : 'Start next wizard'
                }
              </p>
              <p className="mt-0.5 truncate text-sm text-indigo-700">
                {nextAction.wizard.wizards?.name ?? 'Unnamed wizard'}
              </p>
            </div>
            <ChevronRightIcon 
              className="size-5 text-indigo-400 transition group-hover:translate-x-1" 
              aria-hidden="true" 
            />
          </Link>
        </div>
      )}

      {/* Wizards List */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Onboarding Wizards</h2>
          <Link
            href={`/projects/${projectId}/wizards`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all &rarr;
          </Link>
        </div>

        {wizards.length > 0 ? (
          <ul className="divide-y divide-gray-100 rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
            {wizards.slice(0, 5).map((wizard) => (
              <li key={wizard.id}>
                <Link
                  href={`/projects/${projectId}/wizards/${wizard.id}`}
                  className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-x-4">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-indigo-50">
                      {wizard.status === 'completed' ? (
                        <CheckCircleIcon className="size-4 text-green-600" aria-hidden="true" />
                      ) : wizard.status === 'blocked' ? (
                        <ExclamationTriangleIcon className="size-4 text-amber-600" aria-hidden="true" />
                      ) : (
                        <ClipboardDocumentListIcon className="size-4 text-gray-400" aria-hidden="true" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                        {wizard.wizards?.name ?? 'Unnamed wizard'}
                      </p>
                      {wizard.wizards?.description && (
                        <p className="truncate text-xs text-gray-500">
                          {wizard.wizards.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-x-4">
                    <StatusBadge status={wizard.status as WizardStatus} size="sm" showIcon={false} />
                    <span className="text-sm text-gray-500">{wizard.progress_percentage ?? 0}%</span>
                    <ChevronRightIcon className="size-4 text-gray-400" aria-hidden="true" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm ring-1 ring-gray-900/5">
            <ClipboardDocumentListIcon className="mx-auto size-8 text-gray-400" aria-hidden="true" />
            <p className="mt-2 text-sm text-gray-500">No wizards configured for this project yet.</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
