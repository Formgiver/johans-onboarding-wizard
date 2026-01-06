import Link from 'next/link'
import { ArrowRightIcon, CheckCircleIcon, ClockIcon, ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export default function Home() {
  const features = [
    {
      name: 'Automatic Wizard Activation',
      description: 'Wizards automatically activate when sales handover is confirmed',
      icon: CheckCircleIcon,
    },
    {
      name: 'Structured Step Types',
      description: 'Support for text, textarea, select, checkbox, and country-specific inputs',
      icon: ClockIcon,
    },
    {
      name: 'Progress Tracking',
      description: 'Real-time progress calculation with completion tracking',
      icon: ChartBarIcon,
    },
    {
      name: 'PM-Ready Outputs',
      description: 'Automated summaries for customers and project managers',
      icon: DocumentTextIcon,
    },
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
              Onboarding Wizard
            </h1>
            <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl/8">
              Professional onboarding and wizard management system. Streamline your customer onboarding
              with automated workflows, progress tracking, and instant summaries.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/projects"
                className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                View Projects
                <ArrowRightIcon aria-hidden="true" className="ml-2 -mr-0.5 inline-block size-4" />
              </Link>
              <Link
                href="/login"
                className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">Everything you need</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Powerful onboarding features
          </p>
          <p className="mt-6 text-lg/8 text-gray-600">
            Built on top of Supabase with RLS-only security. No service role keys, just secure,
            scalable architecture.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base/7 font-semibold text-gray-900">
                  <feature.icon aria-hidden="true" className="size-5 shrink-0 text-indigo-600" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base/7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
