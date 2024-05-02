import * as React from 'react'

import { Select } from '@mantine/core'
import { type Patient } from '@prisma/client'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { $path } from 'remix-routes'
import { jsonWithSuccess, redirectWithSuccess } from 'remix-toast'

import { type BaseModalProps } from '~/components/global-modals'
import { CustomButton } from '~/components/ui/custom-button'
import { CustomModal } from '~/components/ui/custom-modal'
import { createAppointment } from '~/lib/appointment.server'
import { getDoctors } from '~/lib/doctor.server'
import { useCallbackOnRouteChange } from '~/utils/hooks/use-callback-on-route-change'
import { useFetcherCallback } from '~/utils/hooks/use-fetcher-callback'
import { badRequest } from '~/utils/misc.server'
import EasyModal from '~/utils/modal-manager'
import { DoctorSpecialization } from '~/utils/prisma-enums'
import type { inferErrors } from '~/utils/validation'
import { validateAction } from '~/utils/validation'
import { createAppointmentSchema } from '~/utils/zod.schema'

export const loader = async () => {
  const doctors = await getDoctors()

  if (!doctors) {
    throw new Error('Failed to fetch doctors')
  }

  return json({ doctors })
}

interface ActionData {
  fieldErrors?: inferErrors<typeof createAppointmentSchema>
  success: boolean
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { fieldErrors, fields } = await validateAction(
    request,
    createAppointmentSchema,
  )

  if (fieldErrors) {
    return badRequest({ fieldErrors, success: false })
  }

  await createAppointment(fields)

  return redirectWithSuccess(
    $path('/patient/appointments'),
    'Appointment created successfully!',
  )
}

interface ICreateAppointmentModal extends BaseModalProps {
  patientId: Patient['id']
}

const CREATE_APPOINTMENT_ROUTE = '/resources/create-appointment'
const CREATE_APPOINTMENT_FORM_ID = 'create-appointment-form'

export const CreateAppointmentModal = EasyModal.create(
  (props: ICreateAppointmentModal) => {
    const {
      afterClose,
      afterOpen,
      onClose,
      patientId,

      ...modalProps
    } = props

    const [specialization, setSpecialization] =
      React.useState<DoctorSpecialization | null>(null)

    const onModalClose = async () => {
      onClose?.()
      modalProps.hide()
    }

    const loaderFetcher = useFetcherCallback<typeof loader>()
    const doctors = loaderFetcher.data?.doctors || []
    const isFetchingLoader = loaderFetcher.isPending || !loaderFetcher.data

    React.useEffect(() => {
      loaderFetcher.load(CREATE_APPOINTMENT_ROUTE)
      // We don't want to re-fetch doctors on every render
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetcher = useFetcherCallback<ActionData>()

    useCallbackOnRouteChange(() => onModalClose())

    return (
      <CustomModal
        afterClose={() => afterClose?.()}
        afterOpen={() => afterOpen?.()}
        footerSection={
          <div className="flex items-center justify-end gap-4">
            <CustomButton
              disabled={fetcher.isPending}
              onClick={() => onModalClose()}
              variant="subtle"
            >
              Cancel
            </CustomButton>

            <CustomButton
              disabled={isFetchingLoader}
              form={CREATE_APPOINTMENT_FORM_ID}
              loading={fetcher.isPending}
              type="submit"
            >
              Create
            </CustomButton>
          </div>
        }
        onClose={() => onModalClose()}
        open={modalProps.visible}
        title="Create Appointment"
      >
        <fetcher.Form
          action={CREATE_APPOINTMENT_ROUTE}
          className="flex flex-col gap-4"
          id={CREATE_APPOINTMENT_FORM_ID}
          method="POST"
        >
          <input defaultValue={patientId} hidden name="patientId" />

          <Select
            comboboxProps={{ withinPortal: true }}
            data={Object.values(DoctorSpecialization).map(specialization => ({
              label: specialization,
              value: specialization,
            }))}
            data-autofocus
            error={fetcher.data?.fieldErrors?.specialization}
            label="Specialization"
            name="specialization"
            onChange={val => setSpecialization(val as DoctorSpecialization)}
            placeholder="Select specialization"
            required
            value={specialization}
          />

          {specialization && (
            <Select
              comboboxProps={{ withinPortal: true }}
              data-autofocus
              error={fetcher.data?.fieldErrors?.doctorId}
              label="Doctor"
              name="doctorId"
              placeholder="Select doctor"
              data={doctors
                .filter(doctor => doctor.specialization === specialization)
                .map(doctor => ({
                  label: `${doctor.firstName} ${doctor.lastName}`,
                  value: doctor.id,
                }))}
              required
            ></Select>
          )}
        </fetcher.Form>
      </CustomModal>
    )
  },
)
