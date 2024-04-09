import * as React from 'react'

import { Divider } from '@mantine/core'
import { useNavigate } from '@remix-run/react'
import { BanknoteIcon, ClockIcon } from 'lucide-react'
import { $path } from 'remix-routes'

import { FourOhFour } from '~/components/404'
import { GeneralErrorBoundary } from '~/components/GeneralErrorBoundary'
import { MODAL, openModal } from '~/components/global-modals'
import { SubSection } from '~/components/section'
import { Button } from '~/components/ui/button'
import { useAppointmentData } from '~/routes/admin+/patients+/$patientId+/$appointmentId+/_layout'
import { formatCurrency, formatDate } from '~/utils/misc'
import { PurposeOfVisit } from '~/utils/prisma-enums'

const mapAppointmentToEditAppointment = (
  appointment: ReturnType<typeof useAppointmentData>['appointment'],
) => {
  return {
    conditions: appointment.conditions,
    createdAt: appointment.createdAt,
    doctorId: appointment.doctorId,
    doctor: appointment.doctor,
    id: appointment.id,
    labs: appointment.labs,
    aiGeneratedNotes: appointment.aiGeneratedNotes,
    doctorNotes: appointment.doctorNotes,
    caseReport: appointment.caseReport,
    patientId: appointment.patientId,
    purpose: appointment.purpose,
    updatedAt: appointment.updatedAt,
  }
}

export default function Labs() {
  const { appointment } = useAppointmentData()
  const navigate = useNavigate()

  const labs = appointment.labs

  React.useEffect(() => {
    if (appointment.purpose === PurposeOfVisit.PHARMACY) {
      navigate(
        $path('/admin/patients/:patientId/:appointmentId/overview', {
          patientId: appointment.patientId,
          appointmentId: appointment.id,
        }),
      )
    }
  }, [appointment.id, appointment.patientId, appointment.purpose, navigate])

  return (
    <>
      <SubSection className="flex flex-col gap-4 p-3">
        {labs.length > 0 ? (
          <div className="mt-2 grid grid-cols-3 gap-4">
            {labs.map(({ lab }) => (
              <div
                className="flex flex-col gap-2.5 rounded border p-3"
                key={lab.id}
              >
                <div className="text-center">
                  <p className="text-base font-semibold">{lab.name}</p>
                </div>

                <Divider />

                <div className="flex items-center gap-2 text-gray-900">
                  <ClockIcon className="text-gray-400" size={14} />
                  <p className="text-sm ">
                    {formatDate(lab.createdAt, {
                      timeStyle: 'short',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-gray-900">
                  <BanknoteIcon className="text-gray-400" size={14} />
                  <p className="text-sm ">{formatCurrency(lab.price)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-md border border-dashed border-slate-400 bg-slate-50/75 py-4 text-center">
            <div className="space-y-8">
              <p>No labs added yet!</p>
              <Button
                className="mt-4"
                onClick={() => {
                  openModal(MODAL.editAppointment, {
                    appointment: mapAppointmentToEditAppointment(appointment),
                  })
                }}
                variant="default"
              >
                Add Labs
              </Button>
            </div>
          </div>
        )}
      </SubSection>
    </>
  )
}

export function ErrorBoundary() {
  return (
    <>
      <GeneralErrorBoundary
        className="flex flex-1 items-center justify-center p-2"
        statusHandlers={{
          403: error => (
            <div>
              <h1>Forbidden</h1>
              <div className="my-4" />
              <pre>
                <code className="whitespace-pre text-xs">
                  {JSON.stringify(error, null, 2)}
                </code>
              </pre>
            </div>
          ),
          404: () => <FourOhFour />,
        }}
      />
    </>
  )
}
