import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { $params, $path } from 'remix-routes'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const _params = $params('/doctor/patients/:patientId', params)
  return redirect($path(`/doctor/patients/:patientId/appointments`, _params))
}
