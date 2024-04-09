import { type Table } from '@tanstack/react-table'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react'

import { ActionIconButton } from '~/components/ui/action-icon-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const visibleRows = table.getRowModel().rows.length
  if (visibleRows === 0) {
    return undefined
  }

  const pageCount = table.getPageCount()

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <p className="text-sm">Rows per page</p>

        <Select
          onValueChange={value => table.setPageSize(Number(value))}
          value={String(table.getState().pagination.pageSize)}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {[10, 20, 30, 40, 50].map(pageSize => (
              <SelectItem key={pageSize} value={String(pageSize)}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-6 lg:gap-8">
        <div className="flex items-center justify-center text-sm">
          Page {table.getState().pagination.pageIndex + 1} of {pageCount}
        </div>

        <div className="flex items-center gap-2">
          <ActionIconButton
            className="hidden lg:flex"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon size={16} />
          </ActionIconButton>
          <ActionIconButton
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon size={16} />
          </ActionIconButton>
          <ActionIconButton
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon size={16} />
          </ActionIconButton>
          <ActionIconButton
            className="hidden lg:flex"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(pageCount - 1)}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon size={16} />
          </ActionIconButton>
        </div>
      </div>
    </div>
  )
}
