import { defer, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { TabletsIcon } from 'lucide-react'

import { FourOhFour } from '~/components/404'
import { GeneralErrorBoundary } from '~/components/GeneralErrorBoundary'
import { DashboardErrorLayout } from '~/components/layout/dashboard-error-layout'
import { Page } from '~/components/page'
import { getMedications } from '~/lib/medication.server'

export const loader = async () => {
  const medications = getMedications()

  return json({ medications })
}

export default function Medications() {
  const { medications } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>Medications</h1>
    </div>
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
