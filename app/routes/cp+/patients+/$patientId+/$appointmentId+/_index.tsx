// import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
// import { $params, $path } from 'remix-routes'

// export const loader = ({ params }: LoaderFunctionArgs) => {
//   const { appointmentId, patientId } = $params(
//     '/cp/patients/:patientId/:appointmentId',
//     params,
//   )

//   return redirect(
//     $path('/cp/patients/:patientId/:appointmentId/overview', {
//       appointmentId,
//       patientId,
//     }),
//   )
// }
