import * as React from 'react'

import { type Column, type Table } from '@tanstack/react-table'
import { Reorder, useDragControls } from 'framer-motion'
import _ from 'lodash'
import { GripVerticalIcon } from 'lucide-react'

import { ActionIconButton } from '~/components/ui/action-icon-button'
import { CustomButton } from '~/components/ui/custom-button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
interface DataTableColumnOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableOptions<TData>({
  table,
}: DataTableColumnOptionsProps<TData>) {
  const activeColumns = table
    .getAllColumns()
    .filter(
      column => typeof column.accessorFn !== 'undefined' && column.getCanHide(),
    )

  const [columns, setColumns] = React.useState(() =>
    activeColumns.map(c => c.id),
  )

  React.useEffect(() => {
    const currentColumnOrder = table.getState().columnOrder
    const visibleColumns = table
      .getAllColumns()
      .filter(
        column =>
          typeof column.accessorFn !== 'undefined' &&
          column.getCanHide() &&
          column.getIsVisible(),
      )

    if (currentColumnOrder.length === 0) {
      setColumns(visibleColumns.map(c => c.id))
      return
    }

    if (!_.isEqual(visibleColumns, currentColumnOrder)) {
      setColumns(currentColumnOrder)
    }

    // TODO: This is a hack to get around the fact that the `table` doesn't
    // change when the column order changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnOrder])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CustomButton
          className="text-xsm font-normal text-gray-500"
          color="gray"
          size="compact-sm"
          variant="subtle"
        >
          Options
        </CustomButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <Reorder.Group
          axis="y"
          onReorder={cols => {
            setColumns(cols)
            table.setColumnOrder(cols)
          }}
          values={columns}
        >
          {columns.map(column => {
            const _column = activeColumns.find(c => c.id === column)

            if (!_column) {
              return null
            }

            return <ColumnCheckbox column={_column} key={_column.id} />
          })}
        </Reorder.Group>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ColumnCheckbox<TData>({ column }: { column: Column<TData, unknown> }) {
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      className="flex items-center justify-between gap-2"
      dragControls={dragControls}
      dragListener={false}
      id={column.id}
      value={column.id}
    >
      <DropdownMenuCheckboxItem
        checked={column.getIsVisible()}
        className="flex flex-1 items-center justify-between capitalize"
        key={column.id}
        onCheckedChange={value => column.toggleVisibility(!!value)}
      >
        <span>{column.id}</span>
      </DropdownMenuCheckboxItem>

      <ActionIconButton onPointerDown={event => dragControls.start(event)}>
        <GripVerticalIcon size={14} />
      </ActionIconButton>
    </Reorder.Item>
  )
}
