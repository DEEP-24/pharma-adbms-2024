import { Section } from '~/components/section'
import { cn } from '~/utils/helpers'

export function SettingsPageContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <Section className={cn('gap-8 overflow-auto p-8', className)}>
      {children}
    </Section>
  )
}
