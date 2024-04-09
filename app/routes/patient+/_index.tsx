import { LayoutDashboardIcon } from 'lucide-react'

import { WelcomeCard } from '~/components/card/welcome-card'
import { Page } from '~/components/page'
import { Section, SubSection } from '~/components/section'
import { useUser } from '~/utils/hooks/use-auth'

export default function PatientOverview() {
  const user = useUser()

  return (
    <Page.Layout>
      <Page.Header icon={<LayoutDashboardIcon size={14} />} title="Overview" />

      <Page.Main>
        <div className="flex h-full flex-1 flex-col overflow-auto">
          <Section>
            <div className="flex flex-col gap-4">
              <SubSection className="p-4">
                <WelcomeCard name={user.name} />
                {/* 
                <OverviewCardContainer className="xl:grid-cols-2">
                  <Suspense fallback={<OverviewCustomCardSkeleton />}>
                    <Await resolve={allTimeAppointmentsPromise}>
                      {data => (
                        <OverviewCard
                          chartdata={sampleChartData}
                          name="Today"
                          stat={data}
                        />
                      )}
                    </Await>
                  </Suspense>

                  <Suspense fallback={<OverviewCustomCardSkeleton />}>
                    <Await resolve={allTimeAppointmentsPromise}>
                      {data => (
                        <OverviewCard
                          chartdata={sampleChartData}
                          name="Pending"
                          stat={data}
                        />
                      )}
                    </Await>
                  </Suspense>

                  <Suspense fallback={<OverviewCustomCardSkeleton />}>
                    <Await resolve={appointmentsTodayPromise}>
                      {data => (
                        <OverviewCard
                          chartdata={sampleChartData}
                          name="Completed"
                          stat={data}
                        />
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
