import { type Patient as PrismaPatient } from '@prisma/client'
import { Link } from '@remix-run/react'
import { type ColumnDef, type Row } from '@tanstack/react-table'
import { ArrowUpRightIcon } from 'lucide-react'
import { $path } from 'remix-routes'

import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header'
import { DataTableRowCell } from '~/components/data-table/data-table-row-cell'
import { CustomButton } from '~/components/ui/custom-button'
import { PatientPrescription } from '~/lib/patient.server'
import { genderLabelLookup } from '~/utils/helpers'
import { formatCurrency, formatDate } from '~/utils/misc'
import { Gender } from '~/utils/prisma-enums'

export const patientPrescriptionsColumnDef: ColumnDef<PatientPrescription>[] = [
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
    accessorKey: 'startDate',
    cell: info => (
      <DataTableRowCell
        className="truncate"
        column={info.column}
        table={info.table}
        value={formatDate(info.getValue<Date>())}
      />
    ),
    filterFn: 'fuzzy',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title="Start Date" />
    ),
  },
  {
    accessorKey: 'expiryDate',
    cell: info => (
      <DataTableRowCell
        className="truncate"
        column={info.column}
        table={info.table}
        highlight
        value={formatDate(info.getValue<Date>())}
      />
    ),
    filterFn: 'fuzzy',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        table={table}
        title="Expiry Date"
      />
    ),
  },
  {
    accessorKey: 'totalAmount',
    cell: info => (
      <DataTableRowCell
        column={info.column}
        table={info.table}
        value={formatCurrency(info.getValue<number>())}
      />
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
    filterFn: 'fuzzy',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        table={table}
        title="Total Amount"
      />
    ),
    meta: {
      options: Object.values(Gender).map(type => ({
        label: genderLabelLookup[type],
        value: type,
      })),
    },
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

function TableRowAction({ row }: TableRowActionProps<PatientPrescription>) {
  const patientPrescription = row.original

  return (
    <div className="flex items-center justify-between gap-2">
      <CustomButton
        className="h-6 px-2"
        color="blue"
        component={Link}
        prefetch="intent"
        size="compact-sm"
        to={$path('/doctor/patients/:patientId/:prescriptionId', {
          patientId: patientPrescription.patientId,
          prescriptionId: patientPrescription.id,
        })}
        variant="subtle"
      >
        View
        <ArrowUpRightIcon className="ml-1" size={14} />
      </CustomButton>
    </div>
  )
}
