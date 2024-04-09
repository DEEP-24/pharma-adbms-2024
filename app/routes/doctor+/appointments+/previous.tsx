// import { Suspense } from 'react'

// import { type LoaderFunctionArgs } from '@remix-run/node'
// import { CalendarHeartIcon } from 'lucide-react'
// import { TypedAwait, typeddefer, useTypedLoaderData } from 'remix-typedjson'

// import { Table, TableSkeleton } from '~/components/data-table/table'
// import { Page } from '~/components/page'
// import { Section } from '~/components/section'
// import { getAppointmentsByDoctorId } from '~/lib/appointment.server'
// import { doctorAppointmentsColumnDef } from '~/lib/column-def/doctor-appointments-column-def'
// import { requireUserId } from '~/lib/session.server'

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   const doctorId = await requireUserId(request)

//   const appointmentsPromise = getAppointmentsByDoctorId({
//     doctorId,
//     maxDate: new Date(),
//   })

//   return typeddefer({
//     appointmentsPromise,
//   })
// }
// export default function ManagePatients() {
//   const { appointmentsPromise } = useTypedLoaderData<typeof loader>()

//   return (
//     <>
//       <Page.Layout>
//         <Page.Header
//           icon={<CalendarHeartIcon size={14} />}
//           title="Previous Appointments"
//         />

//         <Page.Main>
//           <Section className="overflow-auto">
//             <Suspense fallback={<TableSkeleton />}>
//               <TypedAwait resolve={appointmentsPromise}>
//                 {appointments => (
//                   <Table
//                     columns={doctorAppointmentsColumnDef}
//                     data={appointments}
//                   />
//                 )}
//               </TypedAwait>
//             </Suspense>
//           </Section>
//         </Page.Main>
//       </Page.Layout>
//     </>
//   )
// }
