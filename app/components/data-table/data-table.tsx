import * as React from 'react'

import { Table, type TableProps } from '@mantine/core'
import {
  type ColumnDef,
  type Table as TanStackTable,
  flexRender,
} from '@tanstack/react-table'

import { DefaultEmptyState } from '~/components/data-table/DefaultEmptyState'
import { DefaultLoadingState } from '~/components/data-table/DefaultLoadingState'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  emptyState?: React.ReactNode
  loading?: boolean
  loadingState?: React.ReactNode
  table: TanStackTable<TData>
  tableProps?: TableProps
}

export function DataTable<TData, TValue>({
  columns,
  emptyState = <DefaultEmptyState />,
  loading = false,
  loadingState = <DefaultLoadingState />,
  table,
  tableProps,
}: DataTableProps<TData, TValue>) {
  // const isFiltered =
  //   table.getState().columnFilters.length > 0 || !!table.getState().globalFilter

  return (
    <>
      <Table
        classNames={{
          tbody: 'border-b',
        }}
        withColumnBorders
        // TODO: Make it work with `overflow-x-auto`
        // stickyHeader
        // stickyHeaderOffset={36 + (isFiltered ? 36 : 0)}
        withTableBorder={false}
        {...tableProps}
      >
        <Table.Thead>
          {table.getHeaderGroups().map(headerGroup => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <Table.Th
                    className="px-0 py-0.5"
                    colSpan={header.colSpan}
                    key={header.id}
                    style={{
                      width:
                        header.getSize() !== 0 ? header.getSize() : undefined,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </Table.Th>
                )
              })}
            </Table.Tr>
          ))}
        </Table.Thead>

        <Table.Tbody className="bg-white">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <React.Fragment key={row.id}>
                <Table.Tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <Table.Td className="py-0.5" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Td>
                  ))}
                </Table.Tr>

                {/* {row.getIsExpanded() ? (
                  <Table.Tr>
                    <Table.Td colSpan={columns.length}>
                      <RenderSubComponent row={row} />
                    </Table.Td>
                  </Table.Tr>
                ) : null} */}
              </React.Fragment>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={columns.length}>
                {loading ? loadingState : emptyState}
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </>
  )
}
