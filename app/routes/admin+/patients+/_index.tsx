// import { Suspense } from 'react'

// import { PlusIcon, Users2Icon } from 'lucide-react'
// import { TypedAwait, typeddefer, useTypedLoaderData } from 'remix-typedjson'

// import { Table, TableSkeleton } from '~/components/data-table/table'
// import { MODAL, openModal } from '~/components/global-modals'
// import { Page } from '~/components/page'
// import { Section } from '~/components/section'
// import { ActionIconButton } from '~/components/ui/action-icon-button'
// import { patientsColumnDef } from '~/lib/column-def/patients-column-def'
// import { getPatients } from '~/lib/patient.server'

// export const loader = async () => {
//   const patientsPromise = getPatients()

//   return typeddefer({
//     patientsPromise,
//   })
// }

// export default function ManagePatients() {
//   const { patientsPromise } = useTypedLoaderData<typeof loader>()

//   return (
//     <>
//       <Page.Layout>
//         <Page.Header
//           action={
//             <ActionIconButton
//               color="dark"
//               onClick={() => openModal(MODAL.createPatient)}
//               variant="filled"
//             >
//               <PlusIcon size={16} />
//             </ActionIconButton>
//           }
//           icon={<Users2Icon size={14} />}
//           title="Patients"
//         />

//         <Page.Main>
//           <Section className="overflow-auto">
//             <Suspense fallback={<TableSkeleton />}>
//               <TypedAwait resolve={patientsPromise}>
//                 {patients => (
//                   <Table columns={patientsColumnDef} data={patients} />
//                 )}
//               </TypedAwait>
//             </Suspense>
//           </Section>
//         </Page.Main>
//       </Page.Layout>
//     </>
//   )
// }
