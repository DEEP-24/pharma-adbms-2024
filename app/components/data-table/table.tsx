import { ScrollArea } from '@mantine/core'
import { type TableView } from '@prisma/client'
import { type ColumnDef } from '@tanstack/react-table'

import { DataTable } from '~/components/data-table/data-table'
import { DataTablePagination } from '~/components/data-table/data-table-pagination'
import { useDataTable } from '~/components/data-table/use-data-table'
import { SubSection } from '~/components/section'
import { SectionFooter } from '~/components/section-footer'
import { SectionHeader } from '~/components/section-header'
import { StickySection } from '~/components/sticky-section'
import { Skeleton } from '~/components/ui/skeleton'

export type ITableView = Pick<TableView, 'data' | 'id' | 'name'>

interface TableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  initialView?: ITableView
}

export function Table<TData, TValue>({
  columns,
  data,
}: TableProps<TData, TValue>) {
  const { table } = useDataTable({
    columns,
    data,
  })

  const isFilteredOrSorted =
    table.getState().columnFilters.length > 0 ||
    !!table.getState().globalFilter ||
    table.getState().sorting.length > 0

  return (
    <>
      {/* <StickySection>
        <SectionHeader
          leftSlot={
            <div className="flex flex-1 items-center">
              <GlobalSearchFilter className="flex-1" table={table} />
            </div>
          }
          rightSlot={<DataTableOptions table={table} />}
        />

        {isFilteredOrSorted ? (
          <SectionHeader
            leftSlot={
              <div className="flex items-center gap-2">
                <CurrentSort table={table} />
                <CurrentColumnFilters table={table} />
                <CurrentGlobalSearchFilter table={table} />
              </div>
            }
            rightSlot={
              <div className="flex items-center gap-1">
                <CustomButton
                  className="px-1.5 font-normal"
                  color="red"
                  onClick={() => table.reset()}
                  size="compact-sm"
                  variant="subtle"
                >
                  Reset
                </CustomButton>
              </div>
            }
          />
        ) : null}
      </StickySection> */}

      <SubSection className="py-0">
        <ScrollArea
          classNames={{
            root: 'overflow-x-auto',
          }}
          offsetScrollbars
          scrollbarSize={8}
          scrollbars="x"
          type="hover"
        >
          <DataTable columns={columns} table={table} />
        </ScrollArea>
      </SubSection>

      {table.getRowModel().rows.length > 0 ? (
        <SectionFooter sticky>
          <DataTablePagination table={table} />
        </SectionFooter>
      ) : null}
    </>
  )
}

export const TableSkeleton = () => {
  return (
    <>
      <StickySection>
        <SectionHeader
          leftSlot={<Skeleton className="h-4 w-full" />}
          rightSlot={<Skeleton className="h-4 w-16" />}
        />
      </StickySection>

      <SubSection className="py-2 pr-2">
        <Skeleton className="h-6" />

        <div>
          <Skeleton className="my-2 h-4" />
          <Skeleton className="my-2 h-4" />
          <Skeleton className="my-2 h-4" />
          <Skeleton className="my-2 h-4" />
        </div>
      </SubSection>

      <SectionFooter sticky>
        <Skeleton className="h-5 w-full" />
      </SectionFooter>
    </>
  )
}
