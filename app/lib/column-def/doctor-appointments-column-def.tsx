// import { Link } from '@remix-run/react'
// import { type ColumnDef, type Row } from '@tanstack/react-table'
// import { CONDITIONS } from '~/data/conditions'
// import { ArrowUpRightIcon } from 'lucide-react'
// import { $path } from 'remix-routes'

// import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header'
// import { DataTableRowCell } from '~/components/data-table/data-table-row-cell'
// import { CustomButton } from '~/components/ui/custom-button'
// import { type getAppointmentsByDoctorId } from '~/lib/appointment.server'
// import { genderLabelLookup } from '~/utils/helpers'
// import { formatDate, formatList } from '~/utils/misc'
// import { Gender } from '~/utils/prisma-enums'

// export type Appointment = Awaited<
//   ReturnType<typeof getAppointmentsByDoctorId>
// >[number]

// export const doctorAppointmentsColumnDef: ColumnDef<Appointment>[] = [
//   {
//     id: 'Date',
//     accessorKey: 'createdAt',
//     cell: info => (
//       <DataTableRowCell
//         className="sticky right-0 truncate"
//         column={info.column}
//         table={info.table}
//         value={formatDate(info.getValue<Date>())}
//       />
//     ),
//     enableColumnFilter: false,
//     enableGlobalFilter: false,
//     header: ({ column, table }) => (
//       <DataTableColumnHeader column={column} table={table} title="Date" />
//     ),
//   },
//   {
//     id: 'id',
//     accessorFn: appointment => appointment.patient.fccId,
//     cell: info => (
//       <DataTableRowCell
//         className="truncate"
//         column={info.column}
//         highlight
//         table={info.table}
//         value={info.getValue<string>()}
//       />
//     ),
//     enableSorting: false,
//     filterFn: 'fuzzy',
//     header: ({ column, table }) => (
//       <DataTableColumnHeader column={column} table={table} title="ID" />
//     ),
//     size: 100,
//   },

//   {
//     id: 'name',
//     accessorFn: appointment => appointment.patient.name,
//     cell: info => (
//       <DataTableRowCell
//         className="truncate"
//         column={info.column}
//         table={info.table}
//         value={info.getValue<string>()}
//       />
//     ),
//     filterFn: 'fuzzy',
//     header: ({ column, table }) => (
//       <DataTableColumnHeader column={column} table={table} title="Name" />
//     ),
//   },
//   {
//     id: 'dob',
//     accessorFn: appointment => appointment.patient.dob,
//     cell: info => (
//       <DataTableRowCell
//         className="truncate"
//         column={info.column}
//         table={info.table}
//         value={formatDate(info.getValue<string>())}
//       />
//     ),
//     filterFn: 'fuzzy',
//     header: ({ column, table }) => (
//       <DataTableColumnHeader column={column} table={table} title="D.O.B" />
//     ),
//   },
//   {
//     id: 'gender',
//     accessorFn: appointment => appointment.patient.gender,
//     cell: info => (
//       <DataTableRowCell
//         column={info.column}
//         table={info.table}
//         value={genderLabelLookup[info.getValue<Gender>()]}
//       />
//     ),
//     enableColumnFilter: false,
//     enableGlobalFilter: false,
//     filterFn: 'fuzzy',
//     header: ({ column, table }) => (
//       <DataTableColumnHeader column={column} table={table} title="Gender" />
//     ),
//     meta: {
//       options: Object.values(Gender).map(type => ({
//         label: genderLabelLookup[type],
//         value: type,
//       })),
//     },
//   },
//   {
//     id: 'phone',
//     accessorFn: appointment => appointment.patient.phone,
//     cell: info => (
//       <DataTableRowCell
//         className="truncate"
//         column={info.column}
//         highlight
//         table={info.table}
//         value={info.getValue<string>()}
//       />
//     ),
//     filterFn: 'fuzzy',
//     header: ({ column, table }) => (
//       <DataTableColumnHeader column={column} table={table} title="Phone" />
//     ),
//   },

//   {
//     accessorFn: appointment =>
//       formatList(
//         appointment.conditions.map(
//           c => CONDITIONS[c as keyof typeof CONDITIONS],
//         ),
//       ),
//     accessorKey: 'conditions',
//     cell: info => (
//       <DataTableRowCell
//         className="max-w-56 truncate"
//         column={info.column}
//         highlight
//         table={info.table}
//         value={info.getValue<string>()}
//       />
//     ),
//     filterFn: 'fuzzy',
//     header: ({ column, table }) => (
//       <DataTableColumnHeader column={column} table={table} title="Conditions" />
//     ),
//   },
//   // {
//   //   accessorFn: appointment =>
//   //     formatList(appointment.labs.map(c => c.lab.name)),
//   //   accessorKey: 'labs',
//   //   cell: info => (
//   //     <DataTableRowCell
//   //       className="max-w-56 truncate"
//   //       column={info.column}
//   //       highlight
//   //       table={info.table}
//   //       value={info.getValue<string>()}
//   //     />
//   //   ),
//   //   filterFn: 'fuzzy',
//   //   header: ({ column, table }) => (
//   //     <DataTableColumnHeader column={column} table={table} title="Labs" />
//   //   ),
//   // },
//   // {
//   //   accessorKey: 'notes',
//   //   cell: info => (
//   //     <DataTableRowCell
//   //       className="max-w-20 truncate"
//   //       column={info.column}
//   //       highlight
//   //       table={info.table}
//   //       value={info.getValue<string>()}
//   //     />
//   //   ),
//   //   filterFn: 'fuzzy',
//   //   header: ({ column, table }) => (
//   //     <DataTableColumnHeader column={column} table={table} title="Notes" />
//   //   ),
//   // },
//   {
//     cell: ({ row }) => <TableRowAction row={row} />,
//     id: 'actions',
//     size: 120,
//   },
// ]

// interface TableRowActionProps<TData> {
//   row: Row<TData>
// }

// function TableRowAction({ row }: TableRowActionProps<Appointment>) {
//   const appointment = row.original

//   return (
//     <div className="flex items-center justify-between gap-2">
//       <CustomButton
//         className="h-6 px-2"
//         color="blue"
//         component={Link}
//         prefetch="intent"
//         size="compact-sm"
//         to={$path('/doctor/appointments/:patientId/:appointmentId/notes', {
//           appointmentId: appointment.id,
//           patientId: appointment.patient.id,
//         })}
//         variant="subtle"
//       >
//         View
//         <ArrowUpRightIcon className="ml-1" size={14} />
//       </CustomButton>
//     </div>
//   )
// }
