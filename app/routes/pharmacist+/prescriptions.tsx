import { NotepadTextIcon } from 'lucide-react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { Table } from '~/components/data-table/table'
import { Page } from '~/components/page'
import { Section } from '~/components/section'
import { pharmacistPatientPrescriptionsColumnDef } from '~/lib/column-def/pharmacist-patient-prescription-def'
import { getAllPrescription } from '~/lib/prescription.server'

export const loader = async () => {
  const prescriptions = await getAllPrescription()

  return typedjson({ prescriptions })
}

export default function ManagePatients() {
  const { prescriptions } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <Page.Layout>
        <Page.Header
          icon={<NotepadTextIcon size={14} />}
          title="Prescriptions"
        />

        <Page.Main>
          <Section className="overflow-auto">
            <Table
              columns={pharmacistPatientPrescriptionsColumnDef}
              data={prescriptions}
            />
          </Section>
        </Page.Main>
      </Page.Layout>
    </>
  )
}
