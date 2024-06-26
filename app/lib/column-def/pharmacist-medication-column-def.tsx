import { type Medication as PrismaMedication } from '@prisma/client'
import { type ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header'
import { DataTableRowCell } from '~/components/data-table/data-table-row-cell'
import { medicationUnitLabelLookup, type DateToString } from '~/utils/helpers'
import { formatCurrency } from '~/utils/misc'
import { MedicationUnit } from '~/utils/prisma-enums'

export type Medication = DateToString<PrismaMedication>

export const pharmacistMedicationColumnDef: ColumnDef<Medication>[] = [
  {
    accessorKey: 'name',
    cell: info => (
      <DataTableRowCell
        className="max-w-[500px] truncate"
        column={info.column}
        highlight
        table={info.table}
        value={info.getValue<string>()}
      />
    ),
    enableColumnFilter: false,
    filterFn: 'fuzzy',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title="Name" />
    ),
  },
  {
    accessorKey: 'brand',
    cell: info => {
      return (
        <DataTableRowCell
          className="w-[100px]"
          column={info.column}
          highlight
          table={info.table}
          value={info.getValue<string>()}
        />
      )
    },
    enableColumnFilter: false,
    filterFn: 'fuzzy',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title="Brand" />
    ),
  },
  {
    accessorFn: row => row.dosage,
    accessorKey: 'dosage',
    cell: info => (
      <DataTableRowCell
        column={info.column}
        highlight
        table={info.table}
        value={info.getValue<string>()}
      />
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title="Dosage" />
    ),
  },
  {
    accessorKey: 'unit',
    cell: info => (
      <DataTableRowCell
        column={info.column}
        highlight
        table={info.table}
        value={medicationUnitLabelLookup[info.getValue<MedicationUnit>()]}
      />
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title="Unit" />
    ),
    meta: {
      options: Object.values(MedicationUnit).map(type => ({
        label: medicationUnitLabelLookup[type],
        value: type,
      })),
    },
  },
  {
    accessorKey: 'quantity',
    cell: ({ row }) => (
      <div className="flex items-center">
        <span>{row.getValue('quantity')}</span>
      </div>
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title="Quantity" />
    ),
  },
  {
    accessorKey: 'price',
    accessorFn: row => formatCurrency(row.price),
    cell: info => (
      <DataTableRowCell
        column={info.column}
        highlight
        table={info.table}
        value={info.getValue<string>()}
      />
    ),
    enableColumnFilter: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title="Price" />
    ),
  },
  {
    accessorKey: 'prescriptionRequired',
    accessorFn: row => (row.prescriptionRequired ? 'Yes' : 'No'),
    cell: info => (
      <DataTableRowCell
        column={info.column}
        highlight
        table={info.table}
        value={info.getValue<string>()}
      />
    ),
    enableColumnFilter: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        table={table}
        title="Prescription Required"
      />
    ),
  },
]
