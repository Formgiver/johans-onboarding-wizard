import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { StatusBadge } from '@/components/ui'

export default async function ProjectsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Projects</h1>
          <p className="mt-6 text-lg/8 text-gray-600">
            You must be logged in to view projects.
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

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name, status, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">Projects</h1>
          <div className="mt-6 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">Error loading projects: {error.message}</p>
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
            href="/"
            className="inline-flex items-center gap-x-1.5 text-sm font-semibold text-gray-900 hover:text-indigo-600"
          >
            <ArrowLeftIcon aria-hidden="true" className="size-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">My Projects</h1>
          <p className="mt-2 text-sm text-gray-600">Logged in as: {user.email}</p>
        </div>

        {/* Projects List */}
        {projects && projects.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: { id: string; name: string; status: string; created_at: string }) => (
              <li
                key={project.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow-sm inset-ring inset-ring-gray-200"
              >
                <div className="flex w-full items-center justify-between gap-x-6 p-6">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h2>
                    <div className="mt-2 flex items-center gap-x-2">
                      <StatusBadge status={project.status as any} />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Created {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <Link
                    href={`/projects/${project.id}/wizards`}
                    className="inline-flex items-center gap-x-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    View Wizards
                    <ChevronRightIcon aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              </li>
            ))}
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
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No projects</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
          </div>
        )}
      </div>
    </div>
  )
}
