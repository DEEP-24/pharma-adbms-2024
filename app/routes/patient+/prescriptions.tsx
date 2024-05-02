import { LoaderFunctionArgs } from '@remix-run/node'
import { NotepadText } from 'lucide-react'

import { typedjson, useTypedLoaderData } from 'remix-typedjson'

import { FourOhFour } from '~/components/404'
import { GeneralErrorBoundary } from '~/components/GeneralErrorBoundary'
import { Table } from '~/components/data-table/table'
import { DashboardErrorLayout } from '~/components/layout/dashboard-error-layout'
import { Page } from '~/components/page'
import { Section } from '~/components/section'
import { patientsPrescriptionsColumnDef } from '~/lib/column-def/patients-prescription-def'
import { getPatientPrescriptionsById } from '~/lib/patient.server'
import { requireUserId } from '~/lib/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const patientId = await requireUserId(request)
  const prescriptions = await getPatientPrescriptionsById(patientId)

  return typedjson({ prescriptions })
}

export default function Prescriptions() {
  const { prescriptions } = useTypedLoaderData<typeof loader>()

  return (
    <Page.Layout>
      <Page.Header icon={<NotepadText size={14} />} title="Prescriptions" />

      <Page.Main>
        <Section className="overflow-auto">
          <Table
            columns={patientsPrescriptionsColumnDef}
            data={prescriptions}
          />
        </Section>
      </Page.Main>
    </Page.Layout>
  )
}

export function ErrorBoundary() {
  return (
    <DashboardErrorLayout
      header={
        <Page.Header icon={<NotepadText size={14} />} title="Prescriptions" />
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
