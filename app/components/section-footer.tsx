import * as React from 'react'

import { cn } from '~/utils/helpers'

export function SectionFooter({
  children,
  sticky = false,
}: {
  children: React.ReactNode
  sticky?: boolean
} & React.DetailsHTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        sticky
          ? 'sticky bottom-0 mt-auto flex min-h-14 items-center border-t bg-white px-4 py-1'
          : '',
      )}
    >
      <div className="flex-1">{children}</div>
    </div>
  )
}
