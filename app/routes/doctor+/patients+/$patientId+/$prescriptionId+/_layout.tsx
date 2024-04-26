import { type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { $params, $path, $routeId } from 'remix-routes'
import { redirect, typedjson, useTypedRouteLoaderData } from 'remix-typedjson'

import { getPrescriptionDetails } from '~/lib/prescription.server'

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
  return (
    <>
      <Outlet />
    </>
  )
}
