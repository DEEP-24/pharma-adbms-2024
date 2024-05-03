import { Button, Input, Modal, Select } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { useFetcher, useNavigate } from '@remix-run/react'
import { type ColumnDef, type Row } from '@tanstack/react-table'
import { ArrowUpRightIcon, MinusCircleIcon } from 'lucide-react'

import * as React from 'react'
import ReactInputMask from 'react-input-mask'
import { $path } from 'remix-routes'
import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header'
import { DataTableRowCell } from '~/components/data-table/data-table-row-cell'
import { CustomButton } from '~/components/ui/custom-button'
import { CartItem, useCart } from '~/context/CartContext'
import { PatientPrescriptionsById } from '~/lib/patient.server'
import { ActionData } from '~/routes/resources+/create-payment'
import { formatDate, titleCase } from '~/utils/misc'
import { PaymentMethod } from '~/utils/prisma-enums'

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
      accessorKey: 'doctor.firstName',
      cell: info => (
        <DataTableRowCell
          column={info.column}
          table={info.table}
          value={
            info.row.original.doctor?.firstName +
            ' ' +
            info.row.original.doctor?.lastName
          }
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
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>(
    PaymentMethod.CREDIT_CARD,
  )
  const patientPrescription = row.original

  const [isViewModalOpen, handleViewModal] = useDisclosure()

  const fetcher = useFetcher<ActionData>()
  const [cardNumber, setCardNumber] = React.useState<string>('1234567891234567')
  const [cardExpiry, setCardExpiry] = React.useState<Date | null>(
    new Date('2026-12-31'),
  )
  const [cardCvv, setCardCvv] = React.useState<string>('123')
  const [errors, setErrors] = React.useState<{
    cardNumber?: string
    cardExpiry?: string
    cardCvv?: string
  }>({
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  })

  const placeOrder = () => {
    setErrors({
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
    })

    if (cardNumber.replace(/[_ ]/g, '').length !== 16) {
      setErrors(prevError => ({
        ...prevError,
        cardNumber: 'Card number must be 16 digits',
      }))
    }

    if (!cardExpiry) {
      setErrors(prevError => ({
        ...prevError,
        cardExpiry: 'Card expiry is required',
      }))
    }

    if (!cardCvv || cardCvv.length !== 3) {
      setErrors(prevError => ({
        ...prevError,
        cardCvv: 'Card CVV must be 3 digits',
      }))
    }

    if (Object.values(errors).some(error => error !== '')) {
      return
    }

    fetcher.submit(
      {
        intent: 'make-payment',
        paymentMethod,
        orderId: patientPrescription.order.id,
      },
      {
        method: 'post',
        action: '/resources/create-payment',
      },
    )
  }

  const isSubmitting = fetcher.state !== 'idle'

  const [isModalOpen, setModalOpen] = React.useState(false)
  const handleOpenModal = () => setModalOpen(true)
  const handleCloseModal = () => setModalOpen(false)

  const isOrderCompletedAndPaymentPending =
    patientPrescription.order.status === 'COMPLETED' &&
    !Boolean(patientPrescription.order.payment)

  React.useEffect(() => {
    if (isSubmitting || !fetcher.data) {
      return
    }

    if (!fetcher.data.success) {
      showNotification({
        title: 'Error',
        message: fetcher.data.message,
        icon: <MinusCircleIcon className="h-7 w-7" />,
        color: 'red',
      })
      return
    }

    showNotification({
      title: 'Success',
      message: fetcher.data.message,
      color: 'green',
    })

    handleCloseModal
    navigate($path('/patient/order-history'))
  }, [fetcher.data, isSubmitting])

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
        <tr><th>Doctor</th><th>${patientPrescription.doctor!.firstName} ${patientPrescription.doctor!.lastName}</th></tr>
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
      {isOrderCompletedAndPaymentPending ? (
        <>
          <CustomButton
            className="h-6 px-2"
            color="blue"
            size="compact-sm"
            variant="subtle"
            onClick={handleOpenModal}
          >
            Payment
            <ArrowUpRightIcon className="ml-1" size={14} />
          </CustomButton>
          <CustomButton
            className="h-6 px-2"
            color="blue"
            size="compact-sm"
            variant="subtle"
            onClick={handleViewModal.open}
          >
            View
            <ArrowUpRightIcon className="ml-1" size={14} />
          </CustomButton>
        </>
      ) : null}

      <Modal
        opened={isModalOpen}
        onClose={handleCloseModal}
        title="Payment"
        centered
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-sm text-gray-600">
              <span className="font-semibold">Amount: </span>
              <span>${patientPrescription.order.totalAmount}</span>
            </h2>
          </div>

          <Select
            label="Payment method"
            value={paymentMethod}
            clearable={false}
            onChange={e => setPaymentMethod(e as PaymentMethod)}
            data={Object.values(PaymentMethod).map(method => ({
              label: titleCase(method.replace(/_/g, ' ')),
              value: method,
            }))}
          />

          <Input.Wrapper
            label="Credit card number"
            required
            error={errors.cardNumber}
          >
            <Input
              component={ReactInputMask}
              mask="9999 9999 9999 9999"
              placeholder="XXXX XXXX XXXX XXXX"
              alwaysShowMask={false}
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
            />
          </Input.Wrapper>

          <div className="flex items-center gap-4">
            <Input.Wrapper label="CVV" required error={errors.cardCvv}>
              <Input
                name="cvv"
                component={ReactInputMask}
                mask="999"
                placeholder="XXX"
                alwaysShowMask={false}
                value={cardCvv}
                onChange={e => setCardCvv(e.target.value)}
              />
            </Input.Wrapper>

            <DatePickerInput
              valueFormat="MM/YYYY"
              clearable={false}
              placeholder="MM/YYYY"
              name="expiry-date"
              label="Expiry"
              required
              value={cardExpiry}
              minDate={new Date()}
              onChange={e => setCardExpiry(e)}
              error={errors.cardExpiry}
              hideOutsideDates
            />
          </div>

          <div className="mt-6 flex items-center gap-4 sm:justify-end">
            <Button
              variant="subtle"
              color="red"
              onClick={() => handleCloseModal()}
            >
              Cancel
            </Button>

            <Button
              variant="filled"
              onClick={() => placeOrder()}
              loading={isSubmitting}
            >
              Place order
            </Button>
          </div>
        </div>
      </Modal>

      <PrescriptionModal
        isOpen={isViewModalOpen}
        onClose={handleViewModal.close}
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
