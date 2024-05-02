import { type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { NotepadText } from 'lucide-react'
import { $params, $path, $routeId } from 'remix-routes'
import { redirect, typedjson, useTypedRouteLoaderData } from 'remix-typedjson'
import { SectionHeader } from '~/components/section-header'
import { StickySection } from '~/components/sticky-section'
import { TabList } from '~/components/tab-list'
import { getAppointmentDetails } from '~/lib/appointment.server'
import { useSafeParams } from '~/utils/hooks/use-safe-params'

export const usePrescriptionData = () => {
  const data = useTypedRouteLoaderData<typeof loader>(
    $routeId('routes/doctor+/patients+/$patientId+/$appointmentId+/_layout'),
  )

  if (!data) {
    throw new Error(
      '`usePrescriptionData()` must be used within a `$patientId/$appointmentId` route',
    )
  }

  return data
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { appointmentId, patientId } = $params(
    '/doctor/patients/:patientId/:appointmentId',
    params,
  )

  const appointment = await getAppointmentDetails({
    appointmentId,
    patientId,
  })

  if (!appointment) {
    throw redirect($path('/doctor/patients/:patientId', { patientId }))
  }

  return typedjson({
    appointment,
  })
}

export default function PatientLayout() {
  const params = useSafeParams('/doctor/patients/:patientId/:appointmentId')

  return (
    <>
      <StickySection>
        <SectionHeader
          leftSlot={
            <TabList
              items={[
                {
                  href: $path(
                    '/doctor/patients/:patientId/:appointmentId/prescriptions',
                    params,
                  ),
                  icon: <NotepadText size={14} />,
                  name: 'Prescriptions',
                },
              ]}
            />
          }
        />
      </StickySection>
      <Outlet />
    </>
  )
}
