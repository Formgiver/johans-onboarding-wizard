import Link from 'next/link'
import { CheckCircleIcon, RocketLaunchIcon, ChartBarIcon, DocumentTextIcon, ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import { Header, Footer } from '@/components/ui'

const features = [
  {
    name: 'Automatic Wizard Activation',
    description: 'Wizards automatically activate when sales handover is confirmed. No manual intervention needed.',
    icon: RocketLaunchIcon,
  },
  {
    name: 'Structured Step Types',
    description: 'Support for text, textarea, select, checkbox, and country-specific inputs with full validation.',
    icon: DocumentTextIcon,
  },
  {
    name: 'Real-time Progress Tracking',
    description: 'Automatic progress calculation with completion tracking. Always know where you stand.',
    icon: ChartBarIcon,
  },
  {
    name: 'PM-Ready Outputs',
    description: 'Automated summaries for customers and project managers. Save hours on documentation.',
    icon: CheckCircleIcon,
  },
]

const ctaFeatures = [
  {
    name: 'Push to deploy.',
    description: 'Quick deployment with built-in Supabase integration and RLS security.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'SSL certificates.',
    description: 'Enterprise-grade security with row-level security policies and no service role keys.',
    icon: LockClosedIcon,
  },
  {
    name: 'Database backups.',
    description: 'Automatic migrations and data integrity with PostgreSQL triggers and constraints.',
    icon: ServerIcon,
  },
]

const benefits = [
  {
    name: 'Performance',
    description: 'Lightning-fast builds with Next.js 16 and Turbopack. Deploy with confidence.',
    color: 'indigo',
  },
  {
    name: 'Security',
    description: 'Row-level security only. No service role keys, just secure, scalable architecture.',
    color: 'indigo',
  },
  {
    name: 'Speed',
    description: 'Built for power users. Complete wizards faster with intelligent form validation.',
    color: 'indigo',
  },
  {
    name: 'Integrations',
    description: 'Seamless Supabase integration with real-time updates and magic link authentication.',
    color: 'indigo',
  },
  {
    name: 'Reliability',
    description: 'PostgreSQL triggers ensure data consistency. Automatic progress calculation.',
    color: 'indigo',
  },
  {
    name: 'Scalability',
    description: 'Built to handle projects of any size. From startup to enterprise.',
    color: 'indigo',
  },
]

export default function Home() {
  return (
    <div className="bg-white">
      <Header />

      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-linear-to-b from-indigo-100/20 pt-14">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:-mr-80 lg:-mr-96"
        />
        <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-8 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl lg:col-span-2 xl:col-auto">
              Professional Onboarding Made Simple
            </h1>
            <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
              <p className="text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                Streamline your customer onboarding with automated workflows, intelligent progress tracking, 
                and instant summaries. Built on Supabase with enterprise-grade security.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href="/projects"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </Link>
                <a href="#features" className="text-sm/6 font-semibold text-gray-900">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <img
              alt="Onboarding workflow dashboard"
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80"
              className="mt-10 aspect-6/5 w-full max-w-lg rounded-2xl object-cover outline-1 -outline-offset-1 outline-black/5 sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 xl:mt-36"
            />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-linear-to-t from-white sm:h-32" />
      </div>

      {/* Features Section */}
      <div id="features" className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">Everything you need</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Powerful onboarding features
          </p>
          <p className="mt-6 text-lg/8 text-gray-600">
            Built on top of Supabase with RLS-only security. No service role keys, just secure,
            scalable architecture that grows with your business.
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

      {/* CTA Section */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-20 sm:rounded-3xl sm:px-10 sm:py-24 lg:py-24 xl:px-24">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center lg:gap-y-0">
              <div className="lg:row-start-2 lg:max-w-md">
                <h2 className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
                  Boost your productivity. Start using our app today.
                </h2>
                <p className="mt-6 text-lg/8 text-gray-300">
                  Join teams who have automated their onboarding process. Save time, reduce errors, 
                  and deliver better customer experiences from day one.
                </p>
              </div>
              <img
                alt="Product screenshot"
                src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
                width={2432}
                height={1442}
                className="relative -z-20 max-w-xl min-w-full rounded-xl shadow-xl ring-1 ring-white/10 lg:row-span-4 lg:w-5xl lg:max-w-none"
              />
              <div className="max-w-xl lg:row-start-3 lg:mt-10 lg:max-w-md lg:border-t lg:border-white/10 lg:pt-10">
                <dl className="max-w-xl space-y-8 text-base/7 text-gray-300 lg:max-w-none">
                  {ctaFeatures.map((feature) => (
                    <div key={feature.name} className="relative">
                      <dt className="ml-9 inline-block font-semibold text-white">
                        <feature.icon aria-hidden="true" className="absolute top-1 left-1 size-5 text-indigo-500" />
                        {feature.name}
                      </dt>{' '}
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-12 -z-10 -translate-y-1/2 transform-gpu blur-3xl lg:top-auto lg:-bottom-48 lg:translate-y-0"
            >
              <div
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
                className="aspect-1155/678 w-288.75 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-25"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Bento Grid */}
      <div id="about" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-base/7 font-semibold text-indigo-600">Deploy faster</h2>
          <p className="mt-2 max-w-lg text-4xl font-semibold tracking-tight text-pretty text-gray-950 sm:text-5xl">
            Everything you need to streamline onboarding
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
            {benefits.slice(0, 2).map((benefit, idx) => (
              <div key={benefit.name} className={`relative ${idx === 0 ? 'lg:col-span-3' : 'lg:col-span-3'}`}>
                <div className={`absolute inset-0 rounded-lg bg-white ${idx === 0 ? 'max-lg:rounded-t-4xl lg:rounded-tl-4xl' : 'lg:rounded-tr-4xl'}`} />
                <div className={`relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] p-10 ${idx === 0 ? 'max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]' : 'lg:rounded-tr-[calc(2rem+1px)]'}`}>
                  <h3 className="text-sm/4 font-semibold text-indigo-600">{benefit.name}</h3>
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950">
                    {benefit.name === 'Performance' ? 'Lightning-fast builds' : 'Enterprise-grade security'}
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600">{benefit.description}</p>
                  <div className="mt-auto pt-8">
                    {benefit.name === 'Performance' ? (
                      <ClockIcon className="size-12 text-indigo-600/20" />
                    ) : (
                      <ShieldCheckIcon className="size-12 text-indigo-600/20" />
                    )}
                  </div>
                </div>
                <div className={`pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 ${idx === 0 ? 'max-lg:rounded-t-4xl lg:rounded-tl-4xl' : 'lg:rounded-tr-4xl'}`} />
              </div>
            ))}
            {benefits.slice(2).map((benefit, idx) => (
              <div key={benefit.name} className="relative lg:col-span-2">
                <div className={`absolute inset-0 rounded-lg bg-white ${idx === 0 ? 'lg:rounded-bl-4xl' : idx === benefits.slice(2).length - 1 ? 'max-lg:rounded-b-4xl lg:rounded-br-4xl' : ''}`} />
                <div className={`relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] p-10 ${idx === 0 ? 'lg:rounded-bl-[calc(2rem+1px)]' : idx === benefits.slice(2).length - 1 ? 'max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]' : ''}`}>
                  <h3 className="text-sm/4 font-semibold text-indigo-600">{benefit.name}</h3>
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950">
                    {benefit.name === 'Speed' ? 'Built for power users' : benefit.name === 'Integrations' ? 'Seamless connections' : benefit.name === 'Reliability' ? 'Always consistent' : 'Enterprise ready'}
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600">{benefit.description}</p>
                </div>
                <div className={`pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 ${idx === 0 ? 'lg:rounded-bl-4xl' : idx === benefits.slice(2).length - 1 ? 'max-lg:rounded-b-4xl lg:rounded-br-4xl' : ''}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
