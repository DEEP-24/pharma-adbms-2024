import { cn } from '~/utils/helpers'

export function SettingsSection({
  children,
  className,
  description,
  title,
}: {
  children: React.ReactNode
  className?: string
  description?: string
  title: string
}) {
  return (
    <div className={cn('flex max-w-96 flex-col gap-4', className)}>
      <div className="space-y-0.5">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xsm text-gray-400">{description}</p>
      </div>

      {children}
    </div>
  )
}
