// import { Divider, ScrollArea } from '@mantine/core'
// import { type LoaderFunctionArgs } from '@remix-run/node'
// import { Outlet, useParams } from '@remix-run/react'
// import {
//   ActivityIcon,
//   AtSignIcon,
//   CalendarIcon,
//   PhoneIcon,
//   PlusIcon,
//   UserIcon,
//   Users2Icon,
// } from 'lucide-react'
// import { $params, $path, $routeId } from 'remix-routes'
// import {
//   redirect,
//   typedjson,
//   useTypedLoaderData,
//   useTypedRouteLoaderData,
// } from 'remix-typedjson'

// import { AppointmentList } from '~/components/appointment-collapsible-list'
// import { MODAL, openModal } from '~/components/global-modals'
// import { Page } from '~/components/page'
// import { Section } from '~/components/section'
// import { SectionHeader } from '~/components/section-header'
// import { StickySection } from '~/components/sticky-section'
// import { TabList } from '~/components/tab-list'
// import { ActionIconButton } from '~/components/ui/action-icon-button'
// import { BreadcrumbItem, Breadcrumbs } from '~/components/ui/breadcrumb'
// import { getPatient } from '~/lib/patient.server'
// import {
//   formatDate,
//   getRelativeTimeString,
//   remixTypedJsonDateFix,
// } from '~/utils/misc'

// export const loader = async ({ params }: LoaderFunctionArgs) => {
//   const { patientId } = $params('/cp/patients/:patientId', params)

//   if (!patientId) {
//     throw redirect($path('/cp/patients'))
//   }

//   const patient = await getPatient(patientId)

//   if (!patient) {
//     throw redirect($path('/cp/patients'))
//   }

//   return typedjson({
//     patient,
//   })
// }

// export function usePatientData() {
//   const data = useTypedRouteLoaderData<typeof loader>(
//     $routeId('routes/cp+/patients+/$patientId+/_layout'),
//   )

//   if (!data) {
//     throw new Error(
//       '`usePatientData()` must be used within a `$patientId+/_layout` route',
//     )
//   }

//   return data
// }

// export default function PatientLayout() {
//   const { patient } = useTypedLoaderData<typeof loader>()
//   const params = useParams() as {
//     appointmentId?: string
//     patientId: string
//   }

//   const isAppointmentRoute = Boolean(params.appointmentId)

//   return (
//     <Page.Layout>
//       <Page.Header
//         action={
//           <ActionIconButton
//             className={isAppointmentRoute ? 'hidden' : ''}
//             color="dark"
//             onClick={() => {
//               if (isAppointmentRoute) {
//                 return
//               }

//               openModal(MODAL.createAppointment, {
//                 patientId: params.patientId,
//               })
//             }}
//             variant="filled"
//           >
//             <PlusIcon size={16} />
//           </ActionIconButton>
//         }
//       >
//         <Breadcrumbs>
//           <BreadcrumbItem
//             href={$path('/cp/patients')}
//             icon={<Users2Icon size={14} />}
//             label="Patients"
//           />
//           <BreadcrumbItem
//             href={$path('/cp/patients/:patientId', params)}
//             isLast={!isAppointmentRoute}
//             label={patient.name}
//           />
//           {isAppointmentRoute ? (
//             <BreadcrumbItem
//               href={$path('/cp/patients/:patientId/:appointmentId', {
//                 patientId: params.patientId,
//                 // @ts-expect-error - `appointmentId` is present in the params
//                 appointmentId: params.appointmentId,
//               })}
//               isLast
//               label="Appointment"
//             />
//           ) : null}
//         </Breadcrumbs>
//       </Page.Header>

//       <Page.Main>
//         <div className="flex h-full flex-1 items-center overflow-hidden">
//           {/* Left sidebar */}
//           <div className="h-full w-72 border-r border-r-stone-200 bg-stone-50">
//             <div className="flex h-full flex-col gap-4">
//               <div className="space-y-4 p-4 pb-0">
//                 <div className="flex flex-col items-center gap-2">
//                   <div className="flex flex-col items-center">
//                     <p className="text-xl font-bold">{patient.name}</p>
//                     <p className="text-sm text-gray-400">
//                       Added{' '}
//                       {getRelativeTimeString(
//                         remixTypedJsonDateFix(patient.createdAt),
//                       )}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-2.5 rounded border p-3">
//                   <div className="flex items-center gap-2 text-gray-700">
//                     <CalendarIcon className="text-gray-400" size={14} />
//                     <p className="text-sm ">{formatDate(patient.dob)}</p>
//                   </div>

//                   <div className="flex items-center gap-2 text-gray-700">
//                     <UserIcon className="text-gray-400" size={14} />
//                     <p className="text-sm ">{patient.gender}</p>
//                   </div>
//                   {patient.email ? (
//                     <div className="flex items-center gap-2 text-gray-700">
//                       <AtSignIcon className="text-gray-400" size={14} />
//                       <p className="text-sm ">{patient.email}</p>
//                     </div>
//                   ) : null}
//                   <div className="flex items-center gap-2 text-gray-700">
//                     <PhoneIcon className="text-gray-400" size={14} />
//                     <p className="text-sm ">{patient.phone}</p>
//                   </div>
//                 </div>
//               </div>

//               <Divider className="mx-2" />

//               <ScrollArea
//                 classNames={{
//                   root: 'flex-1 overflow-auto',
//                 }}
//                 offsetScrollbars
//                 scrollbarSize={8}
//                 type="hover"
//               >
//                 <div className="overflow-hidden px-4">
//                   <AppointmentList
//                     appointments={patient.appointments}
//                     defaultExpanded
//                     title="Appointments"
//                   />
//                 </div>
//               </ScrollArea>
//             </div>
//           </div>

//           <Section className="overflow-auto">
//             {isAppointmentRoute ? null : (
//               <StickySection>
//                 <SectionHeader
//                   leftSlot={
//                     <TabList
//                       items={[
//                         {
//                           href: `appointments`,
//                           icon: <CalendarIcon size={14} />,
//                           name: 'Appointments',
//                         },
//                         {
//                           href: `activity`,
//                           icon: <ActivityIcon size={14} />,
//                           name: 'Activity',
//                         },
//                       ]}
//                     />
//                   }
//                 />
//               </StickySection>
//             )}

//             <Outlet />
//           </Section>
//         </div>
//       </Page.Main>
//     </Page.Layout>
//   )
// }
