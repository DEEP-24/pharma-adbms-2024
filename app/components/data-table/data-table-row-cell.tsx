import * as React from 'react'

import { Highlight } from '@mantine/core'
import { type Column, type Table } from '@tanstack/react-table'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { cn } from '~/utils/helpers'

interface DataTableRowCellProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  highlight?: boolean
  table: Table<TData>
  tooltipLabel?: string
  value: string
}

export const cellTextClassName = 'text-xsm'

export function DataTableRowCell<TData, TValue>({
  className,
  column,
  highlight = false,
  table,
  tooltipLabel,
  value,
}: DataTableRowCellProps<TData, TValue>) {
  const mergedClassName = cn(cellTextClassName, className)

  const filters = [
    table.getState().globalFilter || '',
    column.getFilterValue() || '',
  ]

  const renderContent = () => {
    const val = value || '-'

    if (!highlight) {
      return <div className={mergedClassName}>{val}</div>
    }

    return (
      <Highlight className={mergedClassName} highlight={filters}>
        {val}
      </Highlight>
    )
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{renderContent()}</TooltipTrigger>
        {value ? (
          <TooltipContent side="left">
            <p className="max-w-48">{tooltipLabel ?? value}</p>
          </TooltipContent>
        ) : null}
      </Tooltip>
    </TooltipProvider>
  )
}
