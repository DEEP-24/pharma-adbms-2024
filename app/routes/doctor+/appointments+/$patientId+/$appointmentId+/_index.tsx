import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { $params, $path } from 'remix-routes'

export const loader = ({ params }: LoaderFunctionArgs) => {
  const { appointmentId, patientId } = $params(
    '/admin/patients/:patientId/:appointmentId',
    params,
  )

  return redirect(
    $path('/admin/patients/:patientId/:appointmentId/notes', {
      appointmentId,
      patientId,
    }),
  )
}
