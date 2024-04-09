import { redirect } from '@remix-run/node'
import { $path } from 'remix-routes'

export const loader = async () => {
  return redirect($path('/doctor/appointments'))
}
