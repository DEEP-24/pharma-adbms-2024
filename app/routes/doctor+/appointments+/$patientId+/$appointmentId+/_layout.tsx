// import { type LoaderFunctionArgs } from '@remix-run/node'
// import { Outlet } from '@remix-run/react'
// import { FileTextIcon, StickyNoteIcon, TestTube2Icon } from 'lucide-react'
// import { $params, $path, $routeId } from 'remix-routes'
// import { redirect, typedjson, useTypedRouteLoaderData } from 'remix-typedjson'

// import { SectionHeader } from '~/components/section-header'
// import { StickySection } from '~/components/sticky-section'
// import { TabList } from '~/components/tab-list'
// import { getAppointmentDetails } from '~/lib/appointment.server'
// import { useSafeParams } from '~/utils/hooks/use-safe-params'

// export const useDoctorAppointmentData = () => {
//   const data = useTypedRouteLoaderData<typeof loader>(
//     $routeId(
//       'routes/doctor+/appointments+/$patientId+/$appointmentId+/_layout',
//     ),
//   )

//   if (!data) {
//     throw new Error(
//       '`useDoctorAppointmentData()` must be used within a `$patientId/$appointmentId` route',
//     )
//   }

//   return data
// }

// export const loader = async ({ params }: LoaderFunctionArgs) => {
//   const { appointmentId, patientId } = $params(
//     '/doctor/appointments/:patientId/:appointmentId',
//     params,
//   )

//   const appointment = await getAppointmentDetails({
//     appointmentId,
//     patientId,
//   })

//   if (!appointment) {
//     throw redirect($path('/doctor/appointments'))
//   }

//   return typedjson({
//     appointment,
//   })
// }

// export default function PatientLayout() {
//   const params = useSafeParams('/doctor/appointments/:patientId/:appointmentId')

//   return (
//     <>
//       <StickySection>
//         <SectionHeader
//           leftSlot={
//             <TabList
//               items={[
//                 {
//                   href: $path(
//                     '/doctor/appointments/:patientId/:appointmentId/notes',
//                     params,
//                   ),
//                   icon: <StickyNoteIcon size={14} />,
//                   name: 'Notes',
//                 },
//                 {
//                   href: $path(
//                     '/doctor/appointments/:patientId/:appointmentId/prescription',
//                     params,
//                   ),
//                   icon: <FileTextIcon size={14} />,
//                   name: 'Prescription',
//                 },

//                 {
//                   href: $path(
//                     '/doctor/appointments/:patientId/:appointmentId/labs',
//                     params,
//                   ),
//                   icon: <TestTube2Icon size={14} />,
//                   name: 'Labs',
//                 },
//               ]}
//             />
//           }
//         />
//       </StickySection>

//       <Outlet />
//     </>
//   )
// }
