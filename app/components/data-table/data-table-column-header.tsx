import '@tanstack/react-table'

import * as React from 'react'

import { type Column, type Table } from '@tanstack/react-table'
import { FilterIcon } from 'lucide-react'

import { DataTableFacetedFilter } from '~/components/data-table/data-table-faceted-filter'
import { DataTableFIlterInput } from '~/components/data-table/data-table-filter-input'
import { ActionIconButton } from '~/components/ui/action-icon-button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/utils/helpers'

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  table: Table<TData>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  className,
  column,
  table,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const renderFilter = () => {
    if (column.columnDef.meta?.options) {
      return (
        <DataTableFacetedFilter
          column={column}
          options={column.columnDef.meta.options}
          trigger={
            <ActionIconButton tooltipLabel="Filter">
              <FilterIcon
                className={cn(
                  column.getIsFiltered() ? 'text-blue-600' : 'text-gray-600',
                )}
                size={14}
              />
            </ActionIconButton>
          }
        />
      )
    }

    if (column.getCanFilter()) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <ActionIconButton
              className={cn(
                column.getIsFiltered() ? 'text-blue-600' : 'text-gray-600',
              )}
              tooltipLabel="Filter"
            >
              <FilterIcon size={14} />
            </ActionIconButton>
          </PopoverTrigger>

          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <DataTableFIlterInput column={column} table={table} />
            </div>
          </PopoverContent>
        </Popover>
      )
    }

    return null
  }

  return (
    <div
      className={cn(
        'flex w-full flex-col items-start justify-start gap-2 text-gray-500',
        className,
      )}
    >
      <div className="flex w-full flex-1 items-center justify-between gap-2 ">
        <span className="flex-1 select-none px-2.5 py-1.5 text-xsm font-medium text-gray-500">
          {title}
        </span>

        <div className="flex items-center pr-1">
          {/* {column.getCanSort() ? (
            <ActionIconButton
              className="text-gray-600"
              onClick={() => column.toggleSorting()}
              tooltipLabel={
                column.getIsSorted() === 'desc'
                  ? 'Clear Sort'
                  : column.getIsSorted() === 'asc'
                    ? 'Sort Descending'
                    : 'Sort Ascending'
              }
            >
              {column.getIsSorted() === 'desc' ? (
                <SortDescIcon size={14} />
              ) : column.getIsSorted() === 'asc' ? (
                <SortAscIcon size={14} />
              ) : (
                <ChevronsUpDownIcon size={14} />
              )}
            </ActionIconButton>
          ) : null} */}

          {/* {renderFilter()} */}

          {/* <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <ActionIconButton>
                <MoreVerticalIcon className="text-gray-600" size={14} />
              </ActionIconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="min-w-36"
              collisionPadding={16}
              loop
              side="right"
            >
              {column.getCanSort() ? (
                <DropdownMenuItem
                  className="flex cursor-pointer items-center gap-3"
                  disabled={!column.getIsSorted()}
                  onSelect={() => column.clearSorting()}
                >
                  <XIcon className="text-gray-400" size={14} />
                  Clear Sort
                </DropdownMenuItem>
              ) : null}

              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-3"
                disabled={!column.getIsFiltered()}
                onSelect={() => column.setFilterValue(undefined)}
              >
                <FilterXIcon className="text-gray-400" size={14} />
                Clear Filter
              </DropdownMenuItem>

              {column.getCanHide() ? (
                <DropdownMenuItem
                  className="flex cursor-pointer items-center gap-3"
                  onSelect={() => column.toggleVisibility(false)}
                >
                  <EyeOffIcon className="text-gray-400" size={14} />
                  Hide Column
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
    </div>
  )
}
