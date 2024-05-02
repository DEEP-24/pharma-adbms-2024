import { type ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header'
import { DataTableRowCell } from '~/components/data-table/data-table-row-cell'
import { PatientAppointmentById } from '~/lib/appointment.server'
import {
  doctorQualificationLabelLookup,
  doctorSpecializationLabelLookup,
} from '~/utils/helpers'
import { DoctorQualification, DoctorSpecialization } from '~/utils/prisma-enums'

export const patientsAppointmentsColumnDef: ColumnDef<PatientAppointmentById>[] =
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
      accessorKey: 'doctor.firstName',
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
          title="Doctor FirstName"
        />
      ),
    },
    {
      accessorKey: 'doctor.lastName',
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
          title="Doctor LastName"
        />
      ),
    },
    {
      accessorKey: 'doctor.specialization',
      cell: info => (
        <DataTableRowCell
          column={info.column}
          table={info.table}
          value={
            doctorSpecializationLabelLookup[
              info.getValue<DoctorSpecialization>()
            ]
          }
        />
      ),
      enableColumnFilter: false,
      enableGlobalFilter: false,
      filterFn: 'fuzzy',
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          table={table}
          title="Specialization"
        />
      ),
      meta: {
        options: Object.values(DoctorSpecialization).map(type => ({
          label: doctorSpecializationLabelLookup[type],
          value: type,
        })),
      },
    },
    {
      accessorKey: 'doctor.qualification',
      cell: info => (
        <DataTableRowCell
          column={info.column}
          table={info.table}
          value={
            doctorQualificationLabelLookup[info.getValue<DoctorQualification>()]
          }
        />
      ),
      enableColumnFilter: false,
      enableGlobalFilter: false,
      filterFn: 'fuzzy',
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          table={table}
          title="Qualification"
        />
      ),
      meta: {
        options: Object.values(DoctorQualification).map(type => ({
          label: doctorQualificationLabelLookup[type],
          value: type,
        })),
      },
    },
  ]
