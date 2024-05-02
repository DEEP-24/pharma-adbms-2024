import { Users2Icon } from 'lucide-react'

import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Table, TableSkeleton } from '~/components/data-table/table'
import { Page } from '~/components/page'
import { Section } from '~/components/section'
import { adminPatientsColumnDef } from '~/lib/column-def/admin-patients-column-def'
import { getPatients } from '~/lib/patient.server'

export const loader = async () => {
  const patients = await getPatients()

  return json({ patients })
}

export default function ManagePatients() {
  const { patients } = useLoaderData<typeof loader>()

  return (
    <>
      <Page.Layout>
        <Page.Header icon={<Users2Icon size={14} />} title="Patients" />

        <Page.Main>
          <Section className="overflow-auto">
            {/* @ts-ignore */}
            <Table columns={adminPatientsColumnDef} data={patients} />
          </Section>
        </Page.Main>
      </Page.Layout>
    </>
  )
}
