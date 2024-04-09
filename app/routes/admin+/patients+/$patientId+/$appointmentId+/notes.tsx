import * as React from 'react'

import { Textarea } from '@mantine/core'
import { type ActionFunctionArgs } from '@remix-run/node'
import { Form, Link, useNavigate } from '@remix-run/react'
import { ArrowUpRightIcon, SaveIcon } from 'lucide-react'
import { $params, $path } from 'remix-routes'
import { jsonWithError, jsonWithSuccess } from 'remix-toast'
import { z } from 'zod'

import { useNavigationBlocker } from '~/components/global-blocker-modal'
import { SubSection } from '~/components/section'
import { SectionFooter } from '~/components/section-footer'
import { CustomButton } from '~/components/ui/custom-button'
import { db } from '~/lib/db.server'
import { useAppointmentData } from '~/routes/admin+/patients+/$patientId+/$appointmentId+/_layout'
import { useIsPending } from '~/utils/hooks/use-is-pending'
import { useSafeParams } from '~/utils/hooks/use-safe-params'
import { PurposeOfVisit } from '~/utils/prisma-enums'
import { type inferErrors, validateAction } from '~/utils/validation'

const notesSchema = z.object({
  aiGeneratedNotes: z.string().optional(),
  doctorNotes: z.string().optional(),
  caseReport: z.string().optional(),
})

type ActionData = {
  fieldErrors?: inferErrors<typeof notesSchema>
  success: boolean
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { appointmentId, patientId } = $params(
    '/admin/patients/:patientId/:appointmentId/notes',
    params,
  )
  const { fields, fieldErrors } = await validateAction(request, notesSchema)

  if (fieldErrors) {
    return jsonWithError<ActionData>(
      { success: false, fieldErrors },
      'Something went wrong. Please try again.',
    )
  }

  console.log(fields)

  await db.appointment.update({
    where: {
      id: appointmentId,
      patientId,
    },
    data: {
      caseReport: fields.caseReport,
      aiGeneratedNotes: fields.aiGeneratedNotes,
      doctorNotes: fields.doctorNotes,
    },
  })

  return jsonWithSuccess<ActionData>(
    { success: true },
    'Appointment notes saved successfully',
  )
}

export default function PatientNotes() {
  const params = useSafeParams(
    '/admin/patients/:patientId/:appointmentId/questionnaire',
  )
  const { appointment } = useAppointmentData()

  const navigate = useNavigate()
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

  const pending = useIsPending()

  useNavigationBlocker({
    condition: pending,
  })

  return (
    <>
      <SubSection className="flex flex-col gap-4 p-5">
        <Form className="space-y-5" id="save-notes-form" method="post">
          {appointment.aiGeneratedNotes ? (
            <Textarea
              autosize
              defaultValue={appointment.aiGeneratedNotes || ''}
              label="AI Generated Notes"
              name="aiGeneratedNotes"
            />
          ) : null}

          <div className="grid grid-cols-2 gap-4">
            <Textarea
              defaultValue={appointment.doctorNotes || ''}
              label="Notes"
              name="doctorNotes"
              placeholder="Enter your notes here"
              rows={10}
            />
            <Textarea
              defaultValue={appointment.caseReport || ''}
              label="Case Report"
              name="caseReport"
              placeholder="Enter your case report here"
              rows={10}
            />
          </div>
        </Form>
      </SubSection>

      <SectionFooter sticky>
        <div className="flex items-center justify-end gap-4">
          {!appointment.aiGeneratedNotes ? (
            <CustomButton
              className="font-normal"
              color="dark"
              component={Link}
              rightSection={<ArrowUpRightIcon size={16} />}
              size="compact-sm"
              to={$path(
                '/admin/patients/:patientId/:appointmentId/questionnaire',
                params,
              )}
              type="submit"
              variant="filled"
            >
              Generate Notes
            </CustomButton>
          ) : null}

          <CustomButton
            className="font-normal"
            color="dark"
            form="save-notes-form"
            leftSection={<SaveIcon size={14} />}
            loading={pending}
            size="compact-sm"
            type="submit"
            variant="filled"
          >
            Save
          </CustomButton>
        </div>
      </SectionFooter>
    </>
  )
}
