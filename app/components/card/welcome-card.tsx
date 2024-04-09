import { Divider } from '@mantine/core'

import { cn } from '~/utils/helpers'

interface WelcomeCardProps {
  className?: string
  name: string
}

export function WelcomeCard(props: WelcomeCardProps) {
  const { className, name } = props

  return (
    <div className="flex flex-col gap-4 pb-6 pt-1">
      <div className={cn('flex items-center', className)}>
        <h2 className="text-lg">
          Welcome back,{' '}
          <span className="text-brand text-xl font-semibold">{name}</span>
        </h2>
      </div>

      <Divider />
    </div>
  )
}
