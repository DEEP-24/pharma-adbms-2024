import { type Patient as PrismaPatient } from '@prisma/client'
import { Link } from '@remix-run/react'
import { type ColumnDef, type Row } from '@tanstack/react-table'
import { ArrowUpRightIcon } from 'lucide-react'

import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header'
import { DataTableRowCell } from '~/components/data-table/data-table-row-cell'
import { CustomButton } from '~/components/ui/custom-button'
import { genderLabelLookup } from '~/utils/helpers'
import { formatDate } from '~/utils/misc'
import { Gender } from '~/utils/prisma-enums'

export const doctorsPatientColumnDef: ColumnDef<PrismaPatient>[] = [
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
    accessorKey: 'dob',
    cell: info => (
      <DataTableRowCell
        className="truncate"
        column={info.column}
        table={info.table}
        value={formatDate(info.getValue<string>())}
      />
    ),
    filterFn: 'fuzzy',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        table={table}
        title="Date of Birth"
      />
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
        value={info.getValue<string>()}
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
        value={info.getValue<string>()}
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
    cell: ({ row }) => <TableRowAction row={row} />,
    id: 'actions',
    size: 100,
  },
]

interface TableRowActionProps<TData> {
  row: Row<TData>
}

function TableRowAction({ row }: TableRowActionProps<PrismaPatient>) {
  const patient = row.original

  return (
    <div className="flex items-center justify-between gap-2">
      <CustomButton
        className="h-6 px-2"
        color="blue"
        component={Link}
        prefetch="intent"
        size="compact-sm"
        to={`${patient.id}`}
        variant="subtle"
      >
        View
        <ArrowUpRightIcon className="ml-1" size={14} />
      </CustomButton>
    </div>
  )
}
