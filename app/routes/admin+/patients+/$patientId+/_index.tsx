import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { $params, $path } from 'remix-routes'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const _params = $params('/admin/patients/:patientId', params)
  return redirect($path(`/admin/patients/:patientId/appointments`, _params))
}
