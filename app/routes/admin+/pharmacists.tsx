import { Suspense } from 'react'

import { Users2Icon } from 'lucide-react'

import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Table, TableSkeleton } from '~/components/data-table/table'
import { Page } from '~/components/page'
import { Section } from '~/components/section'
import { getPharmacists } from '~/lib/pharmacist.server'
import { pharmacistsColumnDef } from '~/lib/column-def/pharmacists-column-def'

export const loader = async () => {
  const pharmacists = await getPharmacists()

  return json({ pharmacists })
}

export default function ManageDoctors() {
  const { pharmacists } = useLoaderData<typeof loader>()

  return (
    <>
      <Page.Layout>
        <Page.Header icon={<Users2Icon size={14} />} title="Pharmacists" />

        <Page.Main>
          <Section className="overflow-auto">
            <Suspense fallback={<TableSkeleton />}>
              {/* @ts-ignore */}
              <Table columns={pharmacistsColumnDef} data={pharmacists} />
            </Suspense>
          </Section>
        </Page.Main>
      </Page.Layout>
    </>
  )
}
