import { Suspense } from 'react'

import { Alert } from '@mantine/core'
import { defer } from '@remix-run/node'
import { Await, useLoaderData } from '@remix-run/react'
import { InfoIcon, LayoutDashboardIcon } from 'lucide-react'
import { toast } from 'sonner'

import {
  OverviewCard,
  OverviewCardContainer,
  OverviewCustomCard,
  OverviewCustomCardSkeleton,
} from '~/components/card/overview-card'
import { WelcomeCard } from '~/components/card/welcome-card'
import { Page } from '~/components/page'
import { Section, SubSection } from '~/components/section'
import {
  getLowStockMedications,
  getMedicationCount,
} from '~/lib/medication.server'
import { useUser } from '~/utils/hooks/use-auth'
import { useMedicationSubscription } from '~/utils/hooks/use-notifcations'

export const loader = async () => {
  const lowStockMedicationsPromise = getLowStockMedications()
  const medicationsCountPromise = getMedicationCount()

  return defer({
    lowStockMedicationsPromise,
    medicationsCountPromise,
  })
}

export default function SuperstockistOverview() {
  const user = useUser()

  const { medicationsCountPromise, lowStockMedicationsPromise } =
    useLoaderData<typeof loader>()

  useMedicationSubscription({
    onUpdate: () => {
      toast.info('New medication added')
    },
  })

  return (
    <Page.Layout>
      <Page.Header icon={<LayoutDashboardIcon size={14} />} title="Analytics" />

      <Page.Main>
        <div className="flex h-full flex-1 flex-col overflow-auto">
          <Section>
            <div className="flex flex-col gap-4">
              <SubSection className="p-4">
                <WelcomeCard name={user.fullName} />

                {/* <OverviewCardContainer className="xl:grid-cols-2">
                  <Suspense fallback={<OverviewCustomCardSkeleton />}>
                    <Await resolve={medicationsCountPromise}>
                      {data => (
                        <OverviewCard
                          chartdata={appointmentChartdata}
                          name="Medications"
                          stat={data}
                        />
                      )}
                    </Await>
                  </Suspense>

                  <OverviewCard
                    chartdata={patientChartData}
                    name="Sales"
                    stat={totalMedicaionsSold}
                  />

                  <Suspense fallback={<OverviewCustomCardSkeleton />}>
                    <Await resolve={lowStockMedicationsPromise}>
                      {data => (
                        <OverviewCustomCard name="Low Stock" stat={data.length}>
                          <div className="mt-2">
                            {data.length > 0 ? (
                              <div>
                                {data.map(medication => (
                                  <div
                                    className="flex items-center justify-between gap-4"
                                    key={medication.id}
                                  >
                                    <h4 className="text-sm">
                                      {medication.name} ({medication.quantity}{' '}
                                      left)
                                    </h4>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <Alert
                                color="blue"
                                icon={<InfoIcon size={14} />}
                                title="No low stock medications"
                                variant="light"
                              />
                            )}
                          </div>
                        </OverviewCustomCard>
                      )}
                    </Await>
                  </Suspense>
                </OverviewCardContainer> */}
              </SubSection>
            </div>
          </Section>
        </div>
      </Page.Main>
    </Page.Layout>
  )
}
