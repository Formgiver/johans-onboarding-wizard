import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

type BreadcrumbItem = {
  name: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
  /**
   * Optional: Show home icon as first item
   */
  showHome?: boolean
  homeHref?: string
}

/**
 * Breadcrumbs component for contextual navigation.
 * 
 * Always shows the user's current location in the hierarchy.
 * The last item is displayed as current (non-clickable).
 * 
 * Usage:
 * <Breadcrumbs
 *   items={[
 *     { name: 'Projects', href: '/projects' },
 *     { name: 'Acme Corp', href: '/projects/123' },
 *     { name: 'Sales Handover' }
 *   ]}
 * />
 */
export default function Breadcrumbs({ items, showHome = true, homeHref = '/projects' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol role="list" className="flex items-center space-x-4">
        {showHome && (
          <li>
            <div>
              <Link href={homeHref} className="text-gray-400 hover:text-gray-500">
                <HomeIcon aria-hidden="true" className="size-5 shrink-0" />
                <span className="sr-only">Home</span>
              </Link>
            </div>
          </li>
        )}
        {items.map((item, index) => (
          <li key={item.name}>
            <div className="flex items-center">
              {(showHome || index > 0) && (
                <ChevronRightIcon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-gray-400"
                />
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className="ml-4 text-sm font-medium text-gray-900"
                  aria-current="page"
                >
                  {item.name}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
