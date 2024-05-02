import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { $params, $path } from 'remix-routes'

import { db } from '~/lib/db.server'

interface ActionData {
  success: boolean
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { appointmentId, patientId } = $params(
    '/doctor/patients/:patientId/:appointmentId',
    params,
  )

  return redirect(
    $path('/doctor/patients/:patientId/:appointmentId/prescriptions', {
      patientId,
      appointmentId,
    }),
  )
}
