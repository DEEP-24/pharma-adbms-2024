import { Sparkline, type SparklineProps } from '@mantine/charts'
import { Skeleton } from '@mantine/core'

import { cn } from '~/utils/helpers'

export function OverviewCardContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <dl
      className={cn(
        'grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3',
        className,
      )}
    >
      {children}
    </dl>
  )
}

type SparkChartData = {
  [key: string]: number | string
  index: string
  value: number
}

interface OverviewCardProps {
  chartProps?: Omit<SparklineProps, 'data'>
  chartdata?: SparkChartData[]
  className?: string
  name: string
  stat: number
}

export function OverviewCard(props: OverviewCardProps) {
  const { chartProps, chartdata, name, stat, className } = props

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-md px-4 py-3.5 shadow-card ring-1 ring-gray-200',
        className,
      )}
    >
      <div className="flex items-center space-x-2.5">
        <h2 className="text-lg">{name}</h2>
        <h3 className="hidden sm:block">{stat}</h3>
      </div>

      {chartdata ? (
        <div className="flex flex-col items-center gap-2">
          <Sparkline
            className="h-10 w-24"
            color="blue"
            curveType="monotone"
            data={chartdata.map(item => item.value)}
            fillOpacity={0.3}
            strokeWidth={2}
            {...chartProps}
          />

          <h2 className="hidden text-xs sm:block">Last 10 days</h2>
        </div>
      ) : null}
    </div>
  )
}

interface OverviewCustomCardProps {
  children: React.ReactNode
  className?: string
  name: string
  stat?: number
}

export function OverviewCustomCard(props: OverviewCustomCardProps) {
  const { children, className, name, stat } = props

  return (
    <div
      className={cn(
        'flex flex-col rounded-md px-4 py-3.5 shadow-card ring-1 ring-gray-200',
        className,
      )}
    >
      <div className="flex items-center space-x-2.5">
        <h2 className="text-lg">{name}</h2>
        <h3 className="hidden sm:block">{stat}</h3>
      </div>

      {children}
    </div>
  )
}

export function OverviewCustomCardSkeleton() {
  return (
    <div className="flex h-[92px] items-center justify-between rounded-md px-4 py-3.5 shadow-card ring-1 ring-gray-200">
      <Skeleton className="h-4 w-full" />
    </div>
  )
}
