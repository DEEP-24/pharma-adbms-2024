import { Badge } from '@mantine/core'
import { type Table } from '@tanstack/react-table'
import { MoveDownIcon, MoveUpIcon, XIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { titleCase } from '~/utils/misc'

export function CurrentSort<TData>({ table }: { table: Table<TData> }) {
  const sortingState = table.getState().sorting

  if (sortingState.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      {sortingState.map(sort => {
        return (
          <Button
            key={sort.id}
            onClick={() => table.resetSorting()}
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
                    {sort.desc ? (
                      <MoveDownIcon size={12} strokeWidth={3} />
                    ) : (
                      <MoveUpIcon size={12} strokeWidth={3} />
                    )}
                  </span>

                  <span className="text-xs font-medium">
                    {titleCase(sort.id)}
                  </span>
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
