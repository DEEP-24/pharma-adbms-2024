import { Suspense } from 'react'

import { Users2Icon } from 'lucide-react'

import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Table, TableSkeleton } from '~/components/data-table/table'
import { Page } from '~/components/page'
import { Section } from '~/components/section'
import { adminDoctorsColumnDef } from '~/lib/column-def/admin-doctors-column-def'
import { getDoctors } from '~/lib/doctor.server'

export const loader = async () => {
  const doctors = await getDoctors()

  return json({ doctors })
}

export default function ManageDoctors() {
  const { doctors } = useLoaderData<typeof loader>()

  return (
    <>
      <Page.Layout>
        <Page.Header icon={<Users2Icon size={14} />} title="Doctors" />

        <Page.Main>
          <Section className="overflow-auto">
            <Suspense fallback={<TableSkeleton />}>
              {/* @ts-ignore */}
              <Table columns={adminDoctorsColumnDef} data={doctors} />
            </Suspense>
          </Section>
        </Page.Main>
      </Page.Layout>
    </>
  )
}
