import { Link } from '@remix-run/react'
import { Row, type ColumnDef } from '@tanstack/react-table'
import { ArrowUpRightIcon } from 'lucide-react'

import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header'
import { DataTableRowCell } from '~/components/data-table/data-table-row-cell'
import { CustomButton } from '~/components/ui/custom-button'
import { AppointmentsByPatientId } from '~/lib/appointment.server'
import { usePatientData } from '~/routes/doctor+/patients+/$patientId+/_layout'

export type Appointment = ReturnType<
  typeof usePatientData
>['patient']['appointments'][number]

export const doctorPatientsAppointmentsColumnDef: ColumnDef<AppointmentsByPatientId>[] =
  [
    {
      accessorKey: 'id',
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
        <DataTableColumnHeader
          column={column}
          table={table}
          title="AppointmentId"
        />
      ),
    },
    {
      accessorKey: 'patient.firstName',
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
          title="Patient FirstName"
        />
      ),
    },
    {
      accessorKey: 'patient.lastName',
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
          title="Patient LastName"
        />
      ),
    },
    {
      cell: ({ row }) => <TableRowAction row={row} />,
      id: 'actions',
      size: 120,
    },
  ]

interface TableRowActionProps<TData> {
  row: Row<TData>
}

function TableRowAction({ row }: TableRowActionProps<Appointment>) {
  const appointment = row.original

  return (
    <div className="flex items-center justify-between gap-2">
      <CustomButton
        className="h-6 px-2"
        color="blue"
        component={Link}
        prefetch="intent"
        size="compact-sm"
        to={`../${appointment.id}`}
        variant="subtle"
      >
        View
        <ArrowUpRightIcon className="ml-1" size={14} />
      </CustomButton>
    </div>
  )
}
