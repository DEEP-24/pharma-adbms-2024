import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { BookMinusIcon, PlusIcon } from 'lucide-react'
import { Suspense } from 'react'
import { redirect } from 'remix-typedjson'

import { FourOhFour } from '~/components/404'
import { GeneralErrorBoundary } from '~/components/GeneralErrorBoundary'
import { Table, TableSkeleton } from '~/components/data-table/table'
import { MODAL, openModal } from '~/components/global-modals'
import { DashboardErrorLayout } from '~/components/layout/dashboard-error-layout'
import { Page } from '~/components/page'
import { Section } from '~/components/section'
import { ActionIconButton } from '~/components/ui/action-icon-button'
import { getAppointmentsByPatientId } from '~/lib/appointment.server'
import { patientsAppointmentsColumnDef } from '~/lib/column-def/patients-appointments-def'
import { requireUserId } from '~/lib/session.server'
import { useUser } from '~/utils/hooks/use-auth'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request)
  const appointments = await getAppointmentsByPatientId(userId)

  return json({ appointments })
}

export default function PatientAppointments() {
  const user = useUser()

  const { appointments } = useLoaderData<typeof loader>()

  return (
    <Page.Layout>
      <Page.Header
        action={
          <ActionIconButton
            color="dark"
            onClick={() =>
              openModal(MODAL.createAppointment, {
                patientId: user.id as string,
              })
            }
            variant="white"
          >
            <PlusIcon size={16} />
          </ActionIconButton>
        }
        icon={<BookMinusIcon size={14} />}
        title="Appointments"
      />

      <Page.Main>
        <Section className="overflow-auto">
          <Suspense fallback={<TableSkeleton />}>
            <Table
              columns={patientsAppointmentsColumnDef}
              data={appointments}
            />
          </Suspense>
        </Section>
      </Page.Main>
    </Page.Layout>
  )
}

export function ErrorBoundary() {
  return (
    <DashboardErrorLayout
      header={
        <Page.Header icon={<BookMinusIcon size={14} />} title="Appointments" />
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
