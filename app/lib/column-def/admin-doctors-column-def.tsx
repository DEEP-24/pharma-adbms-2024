import { type Patient as PrismaPatient } from '@prisma/client'
import { type ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header'
import { DataTableRowCell } from '~/components/data-table/data-table-row-cell'
import {
  doctorQualificationLabelLookup,
  doctorSpecializationLabelLookup,
  genderLabelLookup,
} from '~/utils/helpers'
import { formatDate } from '~/utils/misc'
import {
  DoctorQualification,
  DoctorSpecialization,
  Gender,
} from '~/utils/prisma-enums'

export const adminDoctorsColumnDef: ColumnDef<PrismaPatient>[] = [
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
    accessorKey: 'specialization',
    cell: info => (
      <DataTableRowCell
        column={info.column}
        table={info.table}
        value={
          doctorSpecializationLabelLookup[info.getValue<DoctorSpecialization>()]
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
    accessorKey: 'qualification',
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
]
