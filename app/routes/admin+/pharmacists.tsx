import { Suspense } from 'react'

import { PlusIcon, Users2Icon } from 'lucide-react'

import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Table, TableSkeleton } from '~/components/data-table/table'
import { Page } from '~/components/page'
import { Section } from '~/components/section'
import { adminPharmacistsColumnDef } from '~/lib/column-def/admin-pharmacists-column-def'
import { getPharmacists } from '~/lib/pharmacist.server'
import { ActionIconButton } from '~/components/ui/action-icon-button'
import { MODAL, openModal } from '~/components/global-modals'
import { UserRole } from '~/enums'

export const loader = async () => {
  const pharmacists = await getPharmacists()

  return json({ pharmacists })
}

export default function ManageDoctors() {
  const { pharmacists } = useLoaderData<typeof loader>()

  return (
    <>
      <Page.Layout>
        <Page.Header
          icon={<Users2Icon size={14} />}
          title="Pharmacists"
          action={
            <ActionIconButton
              color="dark"
              onClick={() =>
                openModal(MODAL.createUser, {
                  userRole: UserRole.PHARMACIST,
                })
              }
              variant="white"
            >
              <PlusIcon size={16} />
            </ActionIconButton>
          }
        />

        <Page.Main>
          <Section className="overflow-auto">
            <Suspense fallback={<TableSkeleton />}>
              {/* @ts-ignore */}
              <Table columns={adminPharmacistsColumnDef} data={pharmacists} />
            </Suspense>
          </Section>
        </Page.Main>
      </Page.Layout>
    </>
  )
}
