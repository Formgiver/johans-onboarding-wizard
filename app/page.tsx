import Link from 'next/link'
import { 
  ArrowRightIcon, 
  CheckIcon,
  ClipboardDocumentCheckIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

/**
 * Landing Page
 * 
 * Design principles:
 * - Minimal marketing, maximum clarity
 * - Professional, calm aesthetic
 * - Single primary CTA
 * - Clearly communicate what the product does
 */

const valueProps = [
  {
    title: 'For Sales Teams',
    description: 'Complete handover checklists ensure nothing falls through the cracks when passing projects to delivery.',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    title: 'For Project Managers',
    description: 'See project scope, track onboarding progress, and identify blockers at a glance.',
    icon: ArrowTrendingUpIcon,
  },
  {
    title: 'For Customers',
    description: 'Clear guidance on what information is needed and what has been completed.',
    icon: UsersIcon,
  },
]

const features = [
  'Structured onboarding wizards',
  'Automatic progress tracking',
  'Sales handover validation',
  'Customer-friendly input forms',
  'Real-time status updates',
  'Role-based access control',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with navigation */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-x-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-600">
              <svg className="size-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V7.3l7-3.11v8.8z"/>
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-900">Onboarding</span>
          </Link>

          {/* Navigation links */}
          <div className="hidden items-center gap-x-8 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              How it works
            </a>
          </div>

          {/* Auth links */}
          <div className="flex items-center gap-x-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero - simple and clear */}
      <main>
        <div className="relative isolate">
          {/* Subtle background gradient */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.25 -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-indigo-100 to-indigo-50 opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
            />
          </div>

          <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Professional customer onboarding
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600">
              Guide customers through structured onboarding processes. Track progress, 
              validate requirements, and ensure successful project handovers.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/login"
                className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <a 
                href="#how-it-works" 
                className="group inline-flex items-center gap-x-1 text-sm font-semibold text-gray-700"
              >
                How it works 
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Value propositions - who benefits */}
        <div id="how-it-works" className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Clear visibility for everyone
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                One system that gives sales, project managers, and customers the information they need.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-5xl">
              <dl className="grid gap-8 lg:grid-cols-3">
                {valueProps.map((prop) => (
                  <div
                    key={prop.title}
                    className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5"
                  >
                    <dt className="flex items-center gap-x-3">
                      <prop.icon className="size-6 text-indigo-600" aria-hidden="true" />
                      <span className="text-base font-semibold text-gray-900">{prop.title}</span>
                    </dt>
                    <dd className="mt-4 text-sm text-gray-600">{prop.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Simple feature list */}
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Everything you need for structured onboarding
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Purpose-built for professional services teams who need to collect information, 
                  validate requirements, and track project readiness.
                </p>
              </div>
              <div>
                <ul className="space-y-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-x-3">
                      <CheckIcon className="mt-0.5 size-5 shrink-0 text-indigo-600" aria-hidden="true" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Single CTA */}
        <div className="bg-indigo-600">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:flex lg:items-center lg:justify-between lg:px-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Ready to streamline your onboarding?
              </h2>
              <p className="mt-2 text-lg text-indigo-100">
                Sign in to access your projects and onboarding wizards.
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <Link
                href="/login"
                className="inline-flex items-center gap-x-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50"
              >
                Sign in to continue
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Johan&apos;s Onboarding Wizard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
