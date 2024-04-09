// import { Suspense } from 'react'

// import { FlaskConicalIcon, PlusIcon, TabletsIcon } from 'lucide-react'
// import { TypedAwait, typeddefer, useTypedLoaderData } from 'remix-typedjson'

// import { FourOhFour } from '~/components/404'
// import { GeneralErrorBoundary } from '~/components/GeneralErrorBoundary'
// import { Table, TableSkeleton } from '~/components/data-table/table'
// import { MODAL, openModal } from '~/components/global-modals'
// import { DashboardErrorLayout } from '~/components/layout/dashboard-error-layout'
// import { Page } from '~/components/page'
// import { Section } from '~/components/section'
// import { ActionIconButton } from '~/components/ui/action-icon-button'
// import { labColumnDef } from '~/lib/column-def/lab-column-def'
// import { getAvailableLabs } from '~/lib/lab.server'

// export const loader = async () => {
//   const labsPromise = getAvailableLabs()

//   return typeddefer({
//     labsPromise,
//   })
// }

// export default function Labs() {
//   const { labsPromise } = useTypedLoaderData<typeof loader>()

//   return (
//     <>
//       <Page.Layout>
//         <Page.Header
//           action={
//             <ActionIconButton
//               color="dark"
//               onClick={() => openModal(MODAL.createLab)}
//               variant="filled"
//             >
//               <PlusIcon size={16} />
//             </ActionIconButton>
//           }
//           icon={<FlaskConicalIcon size={14} />}
//           title="Labs"
//         />

//         <Page.Main>
//           <Section className="overflow-auto">
//             <Suspense fallback={<TableSkeleton />}>
//               <TypedAwait resolve={labsPromise}>
//                 {labs => <Table columns={labColumnDef} data={labs} />}
//               </TypedAwait>
//             </Suspense>
//           </Section>
//         </Page.Main>
//       </Page.Layout>
//     </>
//   )
// }

// export function ErrorBoundary() {
//   return (
//     <DashboardErrorLayout
//       header={<Page.Header icon={<TabletsIcon size={14} />} title="Labs" />}
//     >
//       <GeneralErrorBoundary
//         className="flex flex-1 items-center justify-center p-2"
//         statusHandlers={{
//           403: error => (
//             <div>
//               <h1>Forbidden</h1>
//               <div className="my-4" />
//               <pre>
//                 <code className="whitespace-pre text-xs">
//                   {JSON.stringify(error, null, 2)}
//                 </code>
//               </pre>
//             </div>
//           ),
//           404: () => <FourOhFour />,
//         }}
//       />
//     </DashboardErrorLayout>
//   )
// }
