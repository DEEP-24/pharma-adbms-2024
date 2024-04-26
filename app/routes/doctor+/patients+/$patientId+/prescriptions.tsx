import { LoaderFunctionArgs } from '@remix-run/node'
import { $params } from 'remix-routes'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { Table } from '~/components/data-table/table'
import { Section } from '~/components/section'
import { doctorsPatientColumnDef } from '~/lib/column-def/doctors-patients-column-def'
import { patientPrescriptionsColumnDef } from '~/lib/column-def/patients-prescription-def'
import { getPatientPrescriptions, getPatients } from '~/lib/patient.server'
import { requireUserId } from '~/lib/session.server'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const doctorId = await requireUserId(request)
  const { patientId } = $params(
    '/doctor/patients/:patientId/prescriptions',
    params,
  )

  const patientPrescriptions = await getPatientPrescriptions({
    doctorId,
    patientId,
  })

  return typedjson({ patientPrescriptions })
}

export default function ManagePatients() {
  const { patientPrescriptions } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <Section className="overflow-auto">
        <Table
          columns={patientPrescriptionsColumnDef}
          data={patientPrescriptions}
        />
      </Section>
    </>
  )
}
