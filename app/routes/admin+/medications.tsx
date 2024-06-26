import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { PlusIcon, TabletsIcon } from 'lucide-react'

import { FourOhFour } from '~/components/404'
import { GeneralErrorBoundary } from '~/components/GeneralErrorBoundary'
import { Table, TableSkeleton } from '~/components/data-table/table'
import { MODAL, openModal } from '~/components/global-modals'
import { DashboardErrorLayout } from '~/components/layout/dashboard-error-layout'
import { Page } from '~/components/page'
import { Section } from '~/components/section'
import { ActionIconButton } from '~/components/ui/action-icon-button'
import { medicationColumnDef } from '~/lib/column-def/medication-column-def'
import { getMedications } from '~/lib/medication.server'

export const loader = async () => {
  const medications = await getMedications()

  return json({ medications })
}

export default function Medications() {
  const { medications } = useLoaderData<typeof loader>()

  return (
    <Page.Layout>
      <Page.Header
        action={
          <ActionIconButton
            color="dark"
            onClick={() => openModal(MODAL.createMedication)}
            variant="white"
          >
            <PlusIcon size={16} />
          </ActionIconButton>
        }
        icon={<TabletsIcon size={14} />}
        title="Medications"
      />

      <Page.Main>
        <Section className="overflow-auto">
          <Table columns={medicationColumnDef} data={medications} />
        </Section>
      </Page.Main>
    </Page.Layout>
  )
}

export function ErrorBoundary() {
  return (
    <DashboardErrorLayout
      header={
        <Page.Header icon={<TabletsIcon size={14} />} title="Medications" />
      }
    >
      <GeneralErrorBoundary
        className="flex flex-1 items-center justify-center p-2"
        statusHandlers={{
          403: error => (
            <div>
              <h1>Forbidden</h1>
              <div className="my-4" />
              <pre>
                <code className="whitespace-pre text-xs">
                  {JSON.stringify(error, null, 2)}
                </code>
              </pre>
            </div>
          ),
          404: () => <FourOhFour />,
        }}
      />
    </DashboardErrorLayout>
  )
}
