import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { StatusBadge } from '@/components/ui'

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
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Wizards</h1>
          <p className="mt-6 text-lg/8 text-gray-600">
            You must be logged in to view wizards.
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

  const { data: project } = await supabase
    .from('projects')
    .select('id, name')
    .eq('id', projectId)
    .single()

  if (!project) {
    notFound()
  }

  const { data: instances, error } = await supabase
    .from('wizard_instances')
    .select(`
      id,
      status,
      activated_at,
      created_at,
      progress_percent,
      wizards (
        id,
        name,
        description
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">Wizards</h1>
          <div className="mt-6 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">Error loading wizards: {error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-x-1.5 text-sm font-semibold text-gray-900 hover:text-indigo-600"
          >
            <ArrowLeftIcon aria-hidden="true" className="size-4" />
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Wizards for {project.name}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage and track all wizard instances for this project.
          </p>
        </div>

        {/* Wizards List */}
        {instances && instances.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {instances.map((instance: { id: string; status: string; created_at: string; progress_percent: number | null; wizards: unknown }) => {
              const wizard = instance.wizards as { id: string; name: string; description: string | null } | null
              return (
                <li
                  key={instance.id}
                  className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow-sm inset-ring inset-ring-gray-200"
                >
                  <div className="flex w-full items-center justify-between gap-x-6 p-6">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-semibold text-gray-900 truncate">
                        {wizard?.name || 'Unknown Wizard'}
                      </h2>
                      {wizard?.description && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{wizard.description}</p>
                      )}
                      <div className="mt-3 flex items-center gap-x-2">
                        <StatusBadge status={instance.status as any} />
                        {instance.progress_percent !== null && instance.progress_percent !== undefined && (
                          <span className="text-xs text-gray-500">
                            {instance.progress_percent}% complete
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Created {new Date(instance.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <Link
                      href={`/projects/${projectId}/wizards/${instance.id}`}
                      className="inline-flex items-center gap-x-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      View Details
                      <ChevronRightIcon aria-hidden="true" className="size-4" />
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="text-center rounded-lg bg-white px-6 py-12 shadow-sm inset-ring inset-ring-gray-200">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="mx-auto size-12 text-gray-400"
            >
              <path
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No wizards</h3>
            <p className="mt-1 text-sm text-gray-500">No wizard instances found for this project.</p>
          </div>
        )}
      </div>
    </div>
  )
}
