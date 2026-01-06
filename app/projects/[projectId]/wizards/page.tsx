import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { 
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { AppShell } from '@/components/layout'
import { StatusBadge, ProgressRing, EmptyState } from '@/components/ui'
import type { WizardStatus } from '@/components/ui'

/**
 * Wizards List Page
 * 
 * Design principles:
 * - Wizards grouped by status (blocked first, then in-progress, then pending, then completed)
 * - Progress visible at a glance
 * - Clear indication of customer vs internal responsibility
 */

type WizardInstance = {
  id: string
  status: string
  progress_percentage: number | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  wizards: {
    id: string
    name: string
    description: string | null
  } | null
}

// Status priority for sorting (blocked first, completed last)
const statusPriority: Record<string, number> = {
  blocked: 0,
  in_progress: 1,
  not_started: 2,
  completed: 3,
}

export default async function WizardsPage({
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

  // Fetch project
  const { data: project } = await supabase
    .from('projects')
    .select('id, name')
    .eq('id', projectId)
    .single()

  if (!project) {
    notFound()
  }

  // Fetch wizard instances (simple query without nested join)
  const { data: instances, error } = await supabase
    .from('wizard_instances')
    .select('id, status, progress_percentage, started_at, completed_at, created_at, wizard_id')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  // Fetch wizard definitions for names
  const wizardIds = (instances ?? []).map(w => w.wizard_id).filter(Boolean)
  const { data: wizardDefs } = wizardIds.length > 0
    ? await supabase.from('wizards').select('id, name, description').in('id', wizardIds)
    : { data: [] }

  if (error) {
    return (
      <AppShell
        user={{ email: user.email ?? '' }}
        breadcrumbs={[
          { name: 'Projects', href: '/projects' },
          { name: project.name, href: `/projects/${projectId}` },
          { name: 'Wizards' },
        ]}
      >
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-200">Error loading wizards: {error.message}</p>
        </div>
      </AppShell>
    )
  }

  // Transform and sort instances
  const rawInstances = instances ?? []
  const transformedInstances: WizardInstance[] = rawInstances.map((w) => {
    const wizardDef = (wizardDefs ?? []).find(d => d.id === w.wizard_id)
    return {
      id: w.id,
      status: w.status,
      progress_percentage: w.progress_percentage,
      started_at: w.started_at,
      completed_at: w.completed_at,
      created_at: w.created_at,
      wizards: wizardDef ? { id: wizardDef.id, name: wizardDef.name, description: wizardDef.description } : null,
    }
  })

  // Sort by status priority
  const sortedInstances = [...transformedInstances].sort((a, b) => {
    const priorityA = statusPriority[a.status] ?? 99
    const priorityB = statusPriority[b.status] ?? 99
    return priorityA - priorityB
  })

  // Group by status
  const groupedWizards = {
    attention: sortedInstances.filter(w => w.status === 'blocked' || w.status === 'in_progress'),
    pending: sortedInstances.filter(w => w.status === 'not_started'),
    completed: sortedInstances.filter(w => w.status === 'completed'),
  }

  // Calculate overall stats
  const totalWizards = sortedInstances.length
  const completedCount = groupedWizards.completed.length
  const overallProgress = totalWizards > 0
    ? Math.round(sortedInstances.reduce((sum, w) => sum + (w.progress_percentage ?? 0), 0) / totalWizards)
    : 0

  return (
    <AppShell
      user={{ email: user.email ?? '' }}
      breadcrumbs={[
        { name: 'Projects', href: '/projects' },
        { name: project.name, href: `/projects/${projectId}` },
        { name: 'Wizards' },
      ]}
    >
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Onboarding Wizards</h1>
            <p className="mt-1 text-sm text-gray-500">
              {project.name} &middot; {completedCount} of {totalWizards} completed
            </p>
          </div>
          <ProgressRing progress={overallProgress} size="md" />
        </div>
      </div>

      {/* Wizards content */}
      {sortedInstances.length > 0 ? (
        <div className="space-y-8">
          {/* Needs Attention Section */}
          {groupedWizards.attention.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-x-2 text-sm font-semibold text-gray-900">
                <span className="flex size-5 items-center justify-center rounded-full bg-amber-100">
                  <ExclamationTriangleIcon className="size-3 text-amber-600" aria-hidden="true" />
                </span>
                Needs Attention ({groupedWizards.attention.length})
              </h2>
              <WizardList wizards={groupedWizards.attention} projectId={projectId} />
            </section>
          )}

          {/* Pending Section */}
          {groupedWizards.pending.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-x-2 text-sm font-semibold text-gray-900">
                <span className="flex size-5 items-center justify-center rounded-full bg-gray-100">
                  <ClockIcon className="size-3 text-gray-600" aria-hidden="true" />
                </span>
                Not Started ({groupedWizards.pending.length})
              </h2>
              <WizardList wizards={groupedWizards.pending} projectId={projectId} />
            </section>
          )}

          {/* Completed Section */}
          {groupedWizards.completed.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-x-2 text-sm font-semibold text-gray-900">
                <span className="flex size-5 items-center justify-center rounded-full bg-green-100">
                  <CheckCircleIcon className="size-3 text-green-600" aria-hidden="true" />
                </span>
                Completed ({groupedWizards.completed.length})
              </h2>
              <WizardList wizards={groupedWizards.completed} projectId={projectId} />
            </section>
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-white p-12 shadow-sm ring-1 ring-gray-900/5">
          <EmptyState
            variant="wizards"
            description="No onboarding wizards have been created for this project yet."
          />
        </div>
      )}
    </AppShell>
  )
}

/**
 * WizardList component for displaying a group of wizards
 */
function WizardList({ wizards, projectId }: { wizards: WizardInstance[]; projectId: string }) {
  return (
    <ul className="divide-y divide-gray-100 rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
      {wizards.map((instance) => (
        <li key={instance.id}>
          <Link
            href={`/projects/${projectId}/wizards/${instance.id}`}
            className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 sm:px-6"
          >
            <div className="flex items-center gap-x-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-indigo-50">
                <ClipboardDocumentListIcon className="size-5 text-gray-400 group-hover:text-indigo-600" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-indigo-600">
                  {instance.wizards?.name ?? 'Unnamed wizard'}
                </p>
                {instance.wizards?.description && (
                  <p className="mt-0.5 truncate text-sm text-gray-500">
                    {instance.wizards.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-x-4">
              <StatusBadge status={instance.status as WizardStatus} size="sm" />
              <div className="hidden items-center gap-x-2 sm:flex">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full transition-all ${
                      instance.status === 'completed' ? 'bg-green-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${instance.progress_percentage ?? 0}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm text-gray-500">
                  {instance.progress_percentage ?? 0}%
                </span>
              </div>
              <ChevronRightIcon className="size-5 text-gray-400" aria-hidden="true" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
