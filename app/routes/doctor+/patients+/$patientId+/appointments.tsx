import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { BookMinusIcon } from 'lucide-react'

import { FourOhFour } from '~/components/404'
import { GeneralErrorBoundary } from '~/components/GeneralErrorBoundary'
import { Table } from '~/components/data-table/table'
import { DashboardErrorLayout } from '~/components/layout/dashboard-error-layout'
import { Page } from '~/components/page'
import { getAppointmentsByPatientId } from '~/lib/appointment.server'
import { doctorPatientsAppointmentsColumnDef } from '~/lib/column-def/doctor-patients-appointments-def'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const patientId = params.patientId

  if (!patientId) {
    return redirect('/doctor/patients')
  }

  const appointments = await getAppointmentsByPatientId(patientId)

  return json({ appointments })
}

export default function Appointments() {
  const { appointments } = useLoaderData<typeof loader>()

  return (
    <Table columns={doctorPatientsAppointmentsColumnDef} data={appointments} />
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
