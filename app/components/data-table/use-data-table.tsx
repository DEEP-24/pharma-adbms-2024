import {
  type ColumnDef,
  type TableState,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { fuzzyFilter, isWithinDateRangeFilter } from '~/utils/data-table.utils'

interface UseDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  initialState?: TableState
}

export function useDataTable<TData, TValue>({
  columns,
  data,
  initialState,
}: UseDataTableProps<TData, TValue>) {
  const table = useReactTable<TData>({
    columns,
    data,
    enableHiding: true,
    enableRowSelection: true,
    filterFns: {
      fuzzy: fuzzyFilter,
      isWithinDateRange: isWithinDateRangeFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // @ts-expect-error
    getRowCanExpand: row => 'subRows' in row.original,
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: fuzzyFilter,
    initialState: {
      ...initialState,
      pagination: { pageSize: 10 },
    },
  })

  return {
    table,
  }
}
