import { type Patient as PrismaPatient } from '@prisma/client'
import { Link } from '@remix-run/react'
import { type ColumnDef, type Row } from '@tanstack/react-table'
import { ArrowUpRightIcon, MoreHorizontalIcon } from 'lucide-react'

import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header'
import { DataTableRowCell } from '~/components/data-table/data-table-row-cell'
import { MODAL, openModal } from '~/components/global-modals'
import { ActionIconButton } from '~/components/ui/action-icon-button'
import { CustomButton } from '~/components/ui/custom-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { genderLabelLookup } from '~/utils/helpers'
import { formatDate } from '~/utils/misc'
import { Gender } from '~/utils/prisma-enums'

export const patientsColumnDef: ColumnDef<PrismaPatient>[] = [
  {
    accessorKey: 'name',
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
      <DataTableColumnHeader column={column} table={table} title="Name" />
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
        to={`${patient.id}/appointments`}
        variant="subtle"
      >
        View
        <ArrowUpRightIcon className="ml-1" size={14} />
      </CustomButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ActionIconButton>
            <MoreHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </ActionIconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => {
              openModal(MODAL.editPatient, {
                patient,
              })
            }}
          >
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
