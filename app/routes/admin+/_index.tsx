import { LayoutDashboardIcon } from 'lucide-react'
import { toast } from 'sonner'
import { WelcomeCard } from '~/components/card/welcome-card'
import { Page } from '~/components/page'
import { Section, SubSection } from '~/components/section'
import { useUser } from '~/utils/hooks/use-auth'

import { useNotifcationSubscription } from '~/utils/hooks/use-notifcations'

export default function AdminOverview() {
  const user = useUser()

  useNotifcationSubscription({
    onUpdate: () => {
      toast.info('New notification!')
    },
  })

  return (
    <Page.Layout>
      <Page.Header icon={<LayoutDashboardIcon size={14} />} title="Overview" />

      <Page.Main>
        <div className="flex h-full flex-1 flex-col overflow-auto">
          <Section>
            <div className="flex flex-col gap-4">
              <SubSection className="p-4">
                <WelcomeCard name={user.name} />
              </SubSection>
            </div>
          </Section>
        </div>
      </Page.Main>
    </Page.Layout>
  )
}
