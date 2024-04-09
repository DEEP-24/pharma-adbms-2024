// import { type LoaderFunctionArgs } from '@remix-run/node'
// import { Outlet } from '@remix-run/react'
// import {
//   FileTextIcon,
//   FolderKanbanIcon,
//   ShieldQuestionIcon,
//   StickyNoteIcon,
//   TestTube2Icon,
// } from 'lucide-react'
// import { $params, $path, $routeId } from 'remix-routes'
// import {
//   redirect,
//   typedjson,
//   useTypedLoaderData,
//   useTypedRouteLoaderData,
// } from 'remix-typedjson'

// import { SectionHeader } from '~/components/section-header'
// import { StickySection } from '~/components/sticky-section'
// import { TabList } from '~/components/tab-list'
// import { getAppointmentDetails } from '~/lib/appointment.server'
// import { useSafeParams } from '~/utils/hooks/use-safe-params'
// import { PurposeOfVisit } from '~/utils/prisma-enums'

// export const useAppointmentData = () => {
//   const data = useTypedRouteLoaderData<typeof loader>(
//     $routeId('routes/admin+/patients+/$patientId+/$appointmentId+/_layout'),
//   )

//   if (!data) {
//     throw new Error(
//       '`useAppointmentData()` must be used within a `$patientId/$appointmentId` route',
//     )
//   }

//   return data
// }

// export const loader = async ({ params }: LoaderFunctionArgs) => {
//   const { appointmentId, patientId } = $params(
//     '/admin/patients/:patientId/:appointmentId',
//     params,
//   )

//   const appointment = await getAppointmentDetails({
//     appointmentId,
//     patientId,
//   })

//   if (!appointment) {
//     throw redirect($path('/admin/patients/:patientId', { patientId }))
//   }

//   return typedjson({
//     appointment,
//   })
// }

// export default function PatientLayout() {
//   const params = useSafeParams('/admin/patients/:patientId/:appointmentId')

//   const { appointment } = useTypedLoaderData<typeof loader>()

//   return (
//     <>
//       <StickySection>
//         <SectionHeader
//           leftSlot={
//             <TabList
//               items={[
//                 {
//                   href: $path(
//                     '/admin/patients/:patientId/:appointmentId/overview',
//                     params,
//                   ),
//                   icon: <FolderKanbanIcon size={14} />,
//                   name: 'Overview',
//                 },
//                 {
//                   href: $path(
//                     '/admin/patients/:patientId/:appointmentId/questionnaire',
//                     params,
//                   ),
//                   icon: <ShieldQuestionIcon size={14} />,
//                   name: 'Questionnaire',
//                   disabled: [
//                     PurposeOfVisit.LAB,
//                     PurposeOfVisit.PHARMACY,
//                   ].includes(appointment.purpose),
//                 },
//                 {
//                   href: $path(
//                     '/admin/patients/:patientId/:appointmentId/prescription',
//                     params,
//                   ),
//                   icon: <FileTextIcon size={14} />,
//                   name: 'Prescription',
//                 },
//                 {
//                   href: $path(
//                     '/admin/patients/:patientId/:appointmentId/notes',
//                     params,
//                   ),
//                   icon: <StickyNoteIcon size={14} />,
//                   name: 'Notes',
//                   disabled: appointment.purpose === PurposeOfVisit.PHARMACY,
//                 },
//                 {
//                   href: $path(
//                     '/admin/patients/:patientId/:appointmentId/labs',
//                     params,
//                   ),
//                   icon: <TestTube2Icon size={14} />,
//                   name: 'Labs',
//                   disabled: appointment.purpose === PurposeOfVisit.PHARMACY,
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
