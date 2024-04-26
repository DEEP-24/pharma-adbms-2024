import { type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { FileTextIcon } from 'lucide-react'
import { $params, $path, $routeId } from 'remix-routes'
import {
  redirect,
  typedjson,
  useTypedLoaderData,
  useTypedRouteLoaderData,
} from 'remix-typedjson'

import { SectionHeader } from '~/components/section-header'
import { StickySection } from '~/components/sticky-section'
import { TabList } from '~/components/tab-list'
import { getPrescriptionDetails } from '~/lib/prescription.server'
import { useSafeParams } from '~/utils/hooks/use-safe-params'

export const usePrescriptionData = () => {
  const data = useTypedRouteLoaderData<typeof loader>(
    $routeId('routes/doctor+/patients+/$patientId+/$prescriptionId+/_layout'),
  )

  if (!data) {
    throw new Error(
      '`usePrescriptionData()` must be used within a `$patientId/$prescriptionId` route',
    )
  }

  return data
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { prescriptionId, patientId } = $params(
    '/doctor/patients/:patientId/:prescriptionId',
    params,
  )

  const prescription = await getPrescriptionDetails({
    prescriptionId,
    patientId,
  })

  if (!prescription) {
    throw redirect($path('/doctor/patients/:patientId', { patientId }))
  }

  return typedjson({
    prescription,
  })
}

export default function PatientLayout() {
  const params = useSafeParams('/doctor/patients/:patientId/:prescriptionId')

  const { prescription } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <StickySection>
        <SectionHeader
          leftSlot={
            <TabList
              items={[
                {
                  href: $path(
                    '/doctor/patients/:patientId/create-prescription',
                    params,
                  ),
                  icon: <FileTextIcon size={14} />,
                  name: 'Prescription',
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
