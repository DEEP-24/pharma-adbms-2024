import { Suspense } from 'react'

import { Users2Icon } from 'lucide-react'

import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Table, TableSkeleton } from '~/components/data-table/table'
import { Page } from '~/components/page'
import { Section } from '~/components/section'
import { getPatients } from '~/lib/patient.server'
import { doctorsPatientColumnDef } from '~/lib/column-def/doctors-patients-column-def'

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
            <Suspense fallback={<TableSkeleton />}>
              {/* @ts-ignore */}
              <Table columns={doctorsPatientColumnDef} data={patients} />
            </Suspense>
          </Section>
        </Page.Main>
      </Page.Layout>
    </>
  )
}
