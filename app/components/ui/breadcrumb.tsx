import * as React from 'react'

import { Link, useMatches } from '@remix-run/react'
import { ChevronRightIcon } from 'lucide-react'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import { cn } from '~/utils/helpers'

export const breadcrumbHandleSchema = z.object({
  breadcrumb: z
    .object({
      href: z.string(),
      icon: z.any(),
      label: z.string(),
    })
    .optional(),
})

export type BreadcrumbHandle = z.infer<typeof breadcrumbHandleSchema>

export const BreadcrumbHandleMatch = z.object({
  handle: breadcrumbHandleSchema,
})

interface BreadcrumbProps {
  children: React.ReactNode | React.ReactNode[]
  params?: Record<string, string>
  seperator?: React.ReactNode
}

export function Breadcrumbs({
  children,
  seperator = <ChevronRightIcon size={14} className="text-neutral-500" />,
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="-ml-1 flex">
      <ol className="flex items-center">
        {React.Children.map(children, (item, index) => {
          if (!React.isValidElement(item)) return null

          return (
            <li className="group flex items-center" key={index}>
              {index > 0 && seperator}
              {item}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

interface BreadcrumbItemProps {
  href: string
  icon?: React.ReactNode
  isLast?: boolean
  label: string
}

export function BreadcrumbItem({
  href,
  icon,
  isLast = false,
  label,
}: BreadcrumbItemProps) {
  return (
    <Button
      asChild
      className={cn(
        'h-6 select-none pr-2 text-sm hover:bg-stone-50',
        isLast
          ? 'pointer-events-none font-medium text-neutral-200 hover:bg-transparent'
          : 'font-normal text-neutral-200 ',
        icon ? 'pl-1' : 'pl-2',
      )}
      disabled={isLast}
      size="sm"
      variant="ghost"
    >
      <Link className="flex items-center gap-2" to={href}>
        {icon}
        {label}
      </Link>
    </Button>
  )
}

export function useBreadcrumbs() {
  const matches = useMatches()
  const breadcrumbs = matches
    .map(m => {
      const result = BreadcrumbHandleMatch.safeParse(m)
      if (!result.success || !result.data.handle.breadcrumb) return null

      return result.data.handle.breadcrumb
    })
    .filter(Boolean)

  return { breadcrumbs }
}
