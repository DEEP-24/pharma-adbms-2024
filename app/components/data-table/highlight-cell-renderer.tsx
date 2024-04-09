import { Highlight } from '@mantine/core'
import { type Table } from '@tanstack/react-table'

import { cn } from '~/utils/helpers'

interface HighlightCellRendererProps<TData> {
  className?: string
  table: Table<TData>
  value: any
}

export default function HighlightCellRenderer<TData>({
  className,
  table,
  value,
}: HighlightCellRendererProps<TData>) {
  return (
    <Highlight
      className={cn('text-sm', className)}
      highlight={table.getState().globalFilter}
    >
      {value}
    </Highlight>
  )
}
