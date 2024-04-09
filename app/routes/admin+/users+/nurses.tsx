// import { Suspense } from 'react'

// import { Await, defer, useLoaderData } from '@remix-run/react'
// import { PlusIcon, Users2Icon } from 'lucide-react'

// import { Table, TableSkeleton } from '~/components/data-table/table'
// import { MODAL, openModal } from '~/components/global-modals'
// import { Page } from '~/components/page'
// import { Section } from '~/components/section'
// import { ActionIconButton } from '~/components/ui/action-icon-button'
// import { userColumnDef } from '~/lib/column-def/user-column-def'
// import { getUsers } from '~/lib/user.server'
// import { UserRole } from '~/utils/prisma-enums'

// export const loader = async () => {
//   const usersPromise = getUsers(UserRole.NURSE)

//   return defer({
//     usersPromise,
//   })
// }

// export default function ManageDoctors() {
//   const { usersPromise } = useLoaderData<typeof loader>()

//   return (
//     <>
//       <Page.Layout>
//         <Page.Header
//           action={
//             <ActionIconButton
//               color="dark"
//               onClick={() =>
//                 openModal(MODAL.createUser, {
//                   userRole: UserRole.NURSE,
//                 })
//               }
//               variant="filled"
//             >
//               <PlusIcon size={16} />
//             </ActionIconButton>
//           }
//           icon={<Users2Icon size={14} />}
//           title="Nurses"
//         />

//         <Page.Main>
//           <Section className="overflow-auto">
//             <Suspense fallback={<TableSkeleton />}>
//               <Await resolve={usersPromise}>
//                 {nurses => <Table columns={userColumnDef} data={nurses} />}
//               </Await>
//             </Suspense>
//           </Section>
//         </Page.Main>
//       </Page.Layout>
//     </>
//   )
// }
