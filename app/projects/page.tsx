import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronRightIcon, FolderIcon } from '@heroicons/react/24/outline'
import { AppShell } from '@/components/layout'
import { StatusBadge, ProgressRing, EmptyState } from '@/components/ui'
import type { WizardStatus } from '@/components/ui'

/**
 * Projects Page
 * 
 * Design principles:
 * - Progress and status are dominant
 * - Clear project cards with immediate workload sense
 * - Strong empty state
 * - Uses AppShell for authenticated layout
 */

type Project = {
  id: string
  name: string
  status: string
  created_at: string
}

type WizardInstance = {
  id: string
  status: string
  progress_percentage: number
}

type ProjectWithProgress = Project & {
  wizard_instances: WizardInstance[]
  totalWizards: number
  completedWizards: number
  avgProgress: number
}

export default async function ProjectsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login')
  }

  // Fetch projects (simple query without join - FK not set up yet)
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, name, status, created_at')
    .order('created_at', { ascending: false })

  // Fetch wizard instances separately
  const { data: allWizardInstances } = await supabase
    .from('wizard_instances')
    .select('id, project_id, status, progress_percentage')

  if (projectsError) {
    return (
      <AppShell 
        user={{ email: user.email ?? '' }}
        breadcrumbs={[{ name: 'Projects' }]}
      >
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-200">Error loading projects: {projectsError.message}</p>
        </div>
      </AppShell>
    )
  }

  // Calculate progress metrics for each project by matching wizard_instances
  const projectsWithProgress: ProjectWithProgress[] = (projects ?? []).map((project) => {
    const wizards = (allWizardInstances ?? []).filter((w) => w.project_id === project.id)
    const totalWizards = wizards.length
    const completedWizards = wizards.filter((w: WizardInstance) => w.status === 'completed').length
    const avgProgress = totalWizards > 0
      ? Math.round(wizards.reduce((sum: number, w: WizardInstance) => sum + (w.progress_percentage ?? 0), 0) / totalWizards)
      : 0

    return {
      ...project,
      wizard_instances: wizards,
      totalWizards,
      completedWizards,
      avgProgress,
    }
  })

  return (
    <AppShell 
      user={{ email: user.email ?? '' }}
      breadcrumbs={[{ name: 'Projects' }]}
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="mt-1 text-sm text-gray-500">
          {projectsWithProgress.length === 0 
            ? 'No active projects'
            : `${projectsWithProgress.length} project${projectsWithProgress.length === 1 ? '' : 's'}`
          }
        </p>
      </div>

      {/* Projects Grid */}
      {projectsWithProgress.length > 0 ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projectsWithProgress.map((project) => (
            <li key={project.id}>
              <Link
                href={`/projects/${project.id}`}
                className="group relative block rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition hover:shadow-md"
              >
                {/* Project header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-x-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 group-hover:bg-indigo-100">
                      <FolderIcon className="size-5 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-semibold text-gray-900 group-hover:text-indigo-600">
                        {project.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {project.totalWizards} wizard{project.totalWizards === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>
                  <ProgressRing progress={project.avgProgress} size="sm" />
                </div>

                {/* Status and progress */}
                <div className="mt-4 flex items-center justify-between">
                  <StatusBadge status={project.status as WizardStatus} />
                  <span className="text-xs text-gray-500">
                    {project.completedWizards}/{project.totalWizards} complete
                  </span>
                </div>

                {/* Hover indicator */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-2 opacity-0 transition group-hover:opacity-100">
                  <span className="inline-flex items-center gap-x-1 text-xs font-medium text-indigo-600">
                    View project
                    <ChevronRightIcon className="size-3" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl bg-white p-12 shadow-sm ring-1 ring-gray-900/5">
          <EmptyState 
            variant="projects"
            description="You don't have any projects assigned yet. Projects will appear here when you're added to an onboarding workflow."
          />
        </div>
      )}
    </AppShell>
  )
}
