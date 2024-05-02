import { type Medication as PrismaMedication } from '@prisma/client'
import { type ColumnDef, type Row } from '@tanstack/react-table'
import { MoreHorizontalIcon } from 'lucide-react'

import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header'
import { DataTableRowCell } from '~/components/data-table/data-table-row-cell'
import { MODAL, openModal } from '~/components/global-modals'
import { ActionIconButton } from '~/components/ui/action-icon-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  type DateToString,
  medicationUnitLabelLookup,
  medicationTypeLabelLookup,
} from '~/utils/helpers'
import { formatCurrency } from '~/utils/misc'
import { MedicationType, MedicationUnit } from '~/utils/prisma-enums'

export type Medication = DateToString<PrismaMedication>

export const medicationColumnDef: ColumnDef<Medication>[] = [
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
    accessorKey: 'type',
    cell: info => (
      <DataTableRowCell
        column={info.column}
        highlight
        table={info.table}
        value={medicationTypeLabelLookup[info.getValue<MedicationType>()]}
      />
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title="Type" />
    ),
    meta: {
      options: Object.values(MedicationType).map(type => ({
        label: medicationTypeLabelLookup[type],
        value: type,
      })),
    },
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
  {
    cell: ({ row }) => <TableRowAction row={row} />,
    id: 'actions',
    size: 50,
  },
]

interface TableRowActionProps<TData> {
  row: Row<TData>
}

function TableRowAction({ row }: TableRowActionProps<Medication>) {
  const medication = row.original

  return (
    <div className="flex max-w-min items-center justify-end">
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
              openModal(MODAL.editMedication, {
                medication,
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
