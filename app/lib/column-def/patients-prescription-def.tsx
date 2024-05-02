import { Modal } from '@mantine/core'
import { type ColumnDef, type Row } from '@tanstack/react-table'
import { ArrowUpRightIcon } from 'lucide-react'

import * as React from 'react'
import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header'
import { DataTableRowCell } from '~/components/data-table/data-table-row-cell'
import { CustomButton } from '~/components/ui/custom-button'
import { CartItem, useCart } from '~/context/CartContext'
import { PatientPrescriptionsById } from '~/lib/patient.server'
import { formatDate } from '~/utils/misc'

export const patientsPrescriptionsColumnDef: ColumnDef<PatientPrescriptionsById>[] =
  [
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
        <DataTableColumnHeader
          column={column}
          table={table}
          title="Start Date"
        />
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
      accessorKey: 'doctor.name',
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
        <DataTableColumnHeader column={column} table={table} title="Doctor" />
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

function TableRowAction({
  row,
}: TableRowActionProps<PatientPrescriptionsById>) {
  const { addItemToCart } = useCart()
  const patientPrescription = row.original

  const [isModalOpen, setModalOpen] = React.useState(false)
  const handleOpenModal = () => setModalOpen(true)
  const handleCloseModal = () => setModalOpen(false)

  const handleAddToCart = () => {
    patientPrescription.medications.forEach(med => {
      const cartItem: CartItem = {
        id: med.medication.id,
        name: med.medication.name,
        brand: med.medication.brand,
        dosage: med.dosage,
        unit: med.unit,
        price: med.medication.price,
        quantity: 1,
        stock: med.medication.quantity,
      }

      addItemToCart(cartItem)
    })
  }

  const prescriptionHtml = `
  <html>
  <head>
    <title>Prescription</title>
    <style>
      body { font-family: Arial, sans-serif; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
    </style>
  </head>
  <body>
    <h1>${patientPrescription.name}</h1>
    <table>
      <tr><th>Start Date</th><td>${formatDate(patientPrescription.startDate)}</td></tr>
      <tr><th>Expiry Date</th><td>${formatDate(patientPrescription.expiryDate)}</td></tr>
      <tr><th>Doctor</th><td>${patientPrescription.doctor!.firstName} ${patientPrescription.doctor!.lastName}</td></tr>
    </table>
    <h2>Medications</h2>
    <table>
      <thead>
        <tr>
          <th>Medication</th>
          <th>Dosage</th>
          <th>Duration</th>
          <th>Frequency</th>
          <th>Timing</th>
          <th>Frequency Timings</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        ${patientPrescription.medications
          .map(
            med => `
          <tr>
            <td>${med.medication.name} (${med.medication.brand})</td>
            <td>${med.dosage} ${med.unit}</td>
            <td>${med.durationNumber} ${med.durationUnit}</td>
            <td>${med.frequency}</td>
            <td>${med.timing}</td>
            <td>${med.frequencyTimings.join(', ')}</td>
            <td>${med.remarks}</td>
          </tr>
        `,
          )
          .join('')}
      </tbody>
    </table>
  </body>
  </html>
`

  return (
    <div className="flex items-center justify-center gap-2">
      <CustomButton
        className="h-6 px-2"
        color="blue"
        size="compact-sm"
        variant="subtle"
        onClick={handleOpenModal}
      >
        View
        <ArrowUpRightIcon className="ml-1" size={14} />
      </CustomButton>
      <CustomButton
        className="h-6 px-2"
        color="blue"
        size="compact-sm"
        variant="filled"
        onClick={handleAddToCart}
      >
        Order
      </CustomButton>

      <PrescriptionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        prescription={prescriptionHtml}
      />
    </div>
  )
}

function PrescriptionModal({
  isOpen,
  onClose,
  prescription,
}: {
  isOpen: boolean
  onClose: () => void
  prescription: string
}) {
  const downloadHref = `data:text/html;charset=utf-8,${encodeURIComponent(prescription)}`

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Prescription Details"
      size="90%"
      style={{ maxWidth: '1200px' }}
    >
      <iframe
        srcDoc={prescription}
        style={{ width: '100%', height: '80vh', marginBottom: '20px' }}
      ></iframe>
      <a
        href={downloadHref}
        download="Prescription.html"
        style={{ display: 'block', textAlign: 'center' }}
      >
        <button
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          Download Prescription
        </button>
      </a>
    </Modal>
  )
}
