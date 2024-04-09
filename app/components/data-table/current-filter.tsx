import { Badge, Divider } from '@mantine/core'
import { type Column } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'

import { ActionIconButton } from '~/components/ui/action-icon-button'
import { titleCase } from '~/utils/misc'

export function CurrentFilter<TData, TValue>(props: {
  column: Column<TData, TValue> | undefined
  name: string
}) {
  const { column, name } = props

  if (!column) {
    return null
  }

  const selectedValues = new Set(column?.getFilterValue() as string[])

  return (
    <div className="flex items-center gap-2">
      {selectedValues?.size > 0 && (
        <>
          <span className="text-sm">{titleCase(name)}</span>
          <Divider orientation="vertical" />

          {Array.from(selectedValues).map(value => {
            return (
              <Badge
                classNames={{
                  label: 'flex items-center gap-2',
                  root: 'rounded pl-1.5 pr-1',
                }}
                color="blue"
                key={value}
                rightSection={
                  <ActionIconButton
                    color="blue"
                    onClick={() => {
                      column.setFilterValue((prev: string[]) => {
                        return prev.filter(v => v !== value).length > 0
                          ? prev.filter(v => v !== value)
                          : undefined
                      })
                    }}
                    size="xs"
                    variant="transparent"
                  >
                    <XIcon size={14} />
                  </ActionIconButton>
                }
                variant="light"
              >
                <span>{value}</span>
              </Badge>
            )
          })}
        </>
      )}
    </div>
  )
}
