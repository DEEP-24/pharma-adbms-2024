import { Modal } from '@mantine/core'
import { Link } from '@remix-run/react'
import { type ColumnDef, type Row } from '@tanstack/react-table'
import { ArrowUpRightIcon } from 'lucide-react'
import { $path } from 'remix-routes'

import * as React from 'react'
import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header'
import { DataTableRowCell } from '~/components/data-table/data-table-row-cell'
import { CustomButton } from '~/components/ui/custom-button'
import { PatientPrescriptionsById } from '~/lib/patient.server'
import { formatCurrency, formatDate } from '~/utils/misc'

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
  const patientPrescription = row.original

  const [isModalOpen, setModalOpen] = React.useState(false)
  const handleOpenModal = () => setModalOpen(true)
  const handleCloseModal = () => setModalOpen(false)

  const prescriptionHtml = `
  <html>
  <head>
    <title>Prescription</title>
  </head>
  <body>
    <h1>${patientPrescription.name}</h1>
    <p><strong>Start Date:</strong> ${formatDate(patientPrescription.startDate)}</p>
    <p><strong>Expiry Date:</strong> ${formatDate(patientPrescription.expiryDate)}</p>
    <p><strong>Total Amount:</strong> ${formatCurrency(patientPrescription.totalAmount)}</p>
    <p><strong>Doctor:</strong> ${patientPrescription.doctor!.name}</p>
    <h2>Medications</h2>
    <ul>
      ${patientPrescription.medications
        .map(
          med => `
        <li>
          <p><strong>Medication:</strong> ${med.medication.name} (${med.medication.brand})</p>
          <p><strong>Dosage:</strong> ${med.dosage} ${med.unit} </p>
          <p><strong>Duration:</strong> ${med.durationNumber} ${med.durationUnit}</p>
          <p><strong>Frequency:</strong> ${med.frequency}</p>
          <p><strong>Timing:</strong> ${med.timing}</p>
          <p><strong>Frequency Timings:</strong> ${med.frequencyTimings.join(', ')}</p>
          <p><strong>Remarks:</strong> ${med.remarks}</p>
        </li>
      `,
        )
        .join('')}
    </ul>
  </body>
  </html>
  `

  return (
    <div className="flex items-center justify-between gap-2">
      <CustomButton
        className="h-6 px-2"
        color="blue"
        component={Link}
        prefetch="intent"
        size="compact-sm"
        to={$path('/patient/prescriptions', {
          prescriptionId: patientPrescription.id,
        })}
        variant="subtle"
        onClick={handleOpenModal}
      >
        View
        <ArrowUpRightIcon className="ml-1" size={14} />
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
      style={{ width: '800px', maxWidth: '90%' }}
    >
      <iframe
        srcDoc={prescription}
        style={{ width: '100%', height: '600px', marginBottom: '20px' }}
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
