import { Badge } from '@mantine/core'
import { type Table } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { titleCase } from '~/utils/misc'

export function CurrentColumnFilters<TData>({
  table,
}: {
  table: Table<TData>
}) {
  const columnFilters = table.getState().columnFilters

  if (columnFilters.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      {columnFilters.map(filter => {
        const _filter = Array.isArray(filter.value)
          ? filter.value.join(', ')
          : filter.value

        return (
          <Button
            key={filter.id}
            onClick={() => {
              table.getColumn(filter.id)?.setFilterValue('')
            }}
            variant="unstyled"
          >
            <Badge
              classNames={{
                root: 'rounded pl-1.5 pr-1',
              }}
              color="blue"
              variant="light"
            >
              <div className="flex items-center justify-between gap-2 normal-case">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold">
                    {titleCase(filter.id)}
                  </span>
                  <span>:</span>
                  {/* @ts-expect-error - TODO: Fix later */}
                  <span className="text-xs font-medium">{_filter}</span>
                </div>

                <XIcon size={14} />
              </div>
            </Badge>
          </Button>
        )
      })}
    </div>
  )
}
