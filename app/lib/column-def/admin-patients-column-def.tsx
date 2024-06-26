import { type Patient as PrismaPatient } from '@prisma/client'
import { type ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header'
import { DataTableRowCell } from '~/components/data-table/data-table-row-cell'
import { genderLabelLookup } from '~/utils/helpers'
import { formatDate } from '~/utils/misc'
import { Gender } from '~/utils/prisma-enums'

export const adminPatientsColumnDef: ColumnDef<PrismaPatient>[] = [
  {
    accessorKey: 'firstName',
    cell: info => (
      <DataTableRowCell
        className="truncate"
        column={info.column}
        table={info.table}
        value={info.getValue<string>()}
      />
    ),
    filterFn: 'fuzzy',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title="First Name" />
    ),
  },
  {
    accessorKey: 'lastName',
    cell: info => (
      <DataTableRowCell
        className="truncate"
        column={info.column}
        table={info.table}
        value={info.getValue<string>()}
      />
    ),
    filterFn: 'fuzzy',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title="Last Name" />
    ),
  },
  {
    accessorKey: 'age',
    cell: info => (
      <DataTableRowCell
        className="truncate"
        column={info.column}
        table={info.table}
        value={info.getValue<string>()}
      />
    ),
    filterFn: 'fuzzy',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title="Age" />
    ),
  },
  {
    accessorKey: 'email',
    cell: info => (
      <DataTableRowCell
        className="truncate"
        column={info.column}
        table={info.table}
        highlight
        value={info.getValue<string>()}
      />
    ),
    filterFn: 'fuzzy',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title="Email" />
    ),
  },
  {
    accessorKey: 'gender',
    cell: info => (
      <DataTableRowCell
        column={info.column}
        table={info.table}
        value={genderLabelLookup[info.getValue<Gender>()]}
      />
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
    filterFn: 'fuzzy',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title="Gender" />
    ),
    meta: {
      options: Object.values(Gender).map(type => ({
        label: genderLabelLookup[type],
        value: type,
      })),
    },
  },
  {
    accessorKey: 'height',
    cell: info => (
      <DataTableRowCell
        column={info.column}
        table={info.table}
        value={info.getValue<number>().toString()}
      />
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
    filterFn: 'fuzzy',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        table={table}
        title="Height (cm)"
      />
    ),
  },
  {
    accessorKey: 'weight',
    cell: info => (
      <DataTableRowCell
        column={info.column}
        table={info.table}
        value={info.getValue<number>().toString()}
      />
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
    filterFn: 'fuzzy',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        table={table}
        title="Weight (pounds)"
      />
    ),
  },
  {
    accessorKey: 'address',
    cell: info => (
      <DataTableRowCell
        column={info.column}
        table={info.table}
        value={info.getValue<string>()}
      />
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
    filterFn: 'fuzzy',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title="Address" />
    ),
  },
  {
    accessorKey: 'phone',
    cell: info => (
      <DataTableRowCell
        className="truncate"
        column={info.column}
        highlight
        table={info.table}
        value={info.getValue<string>()}
      />
    ),
    filterFn: 'fuzzy',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title="Phone" />
    ),
  },
]
