import { cn } from '~/utils/helpers'

export function StickySection({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('sticky top-0 z-10 flex flex-col bg-white', className)}>
      {children}
    </div>
  )
}
