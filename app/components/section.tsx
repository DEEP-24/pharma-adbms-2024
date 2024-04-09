import { cn } from '~/utils/helpers'

export function Section({
  children,
  className,
  ...delegateProps
}: {
  children: React.ReactNode
} & React.DetailsHTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex h-full flex-1 flex-col', className)}
      {...delegateProps}
    >
      {children}
    </div>
  )
}

export function SubSection({
  children,
  className,
  ...delegateProps
}: {
  children: React.ReactNode
} & React.DetailsHTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex-1 px-2 py-3', className)} {...delegateProps}>
      {children}
    </div>
  )
}
