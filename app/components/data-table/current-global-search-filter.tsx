import { Badge } from '@mantine/core'
import { type Table } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'

export function CurrentGlobalSearchFilter<TData>({
  table,
}: {
  table: Table<TData>
}) {
  const globalFilter = table.getState().globalFilter as string | undefined

  return (
    <>
      {globalFilter ? (
        <Button
          onClick={() => {
            table.resetGlobalFilter(true)
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
                <span className="text-xs font-bold">Global</span>
                <span>:</span>
                <span className="text-xs font-medium">{globalFilter}</span>
              </div>

              <XIcon size={14} />
            </div>
          </Badge>
        </Button>
      ) : null}
    </>
  )
}
