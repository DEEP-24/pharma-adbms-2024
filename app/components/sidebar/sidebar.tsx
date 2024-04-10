import { ScrollArea } from '@mantine/core'
import { useMatches } from '@remix-run/react'
import { ArrowLeftIcon } from 'lucide-react'

import { ActionIconButton } from '~/components/ui/action-icon-button'
import { DashboardView, cn } from '~/utils/helpers'
import { useGoBack } from '~/utils/hooks/use-go-back'
import { useSidebarStore } from '~/utils/store/sidebar-store'

import { useUser } from '~/utils/hooks/use-auth'
import { SidebarHeader } from './sidebar-header'
import { SidebarList, type SidebarListProps } from './sidebar-list'
import { UserDetailsButton } from './user-details-button'

function BackButton() {
  const goBack = useGoBack({
    fallback: '/',
  })

  return (
    <div className="flex items-center gap-1">
      <ActionIconButton onClick={() => goBack()}>
        <ArrowLeftIcon size={16} />
      </ActionIconButton>
      <span className="font-semibold text-neutral-200">Settings</span>
    </div>
  )
}

export function Sidebar({
  items,
  user,
  variant = DashboardView.expanded,
}: {
  items: SidebarListProps[]
  user: ReturnType<typeof useUser>
  variant?: DashboardView
}) {
  const matches = useMatches()

  const isSidebarOpen = useSidebarStore(state => state.isOpen)
  const isSettingsPage = matches.some(match => match.id.includes('settings+'))

  return (
    <aside
      className={cn(
        'group/sidebar relative h-full overflow-hidden bg-neutral-700 transition-all duration-300',
        isSidebarOpen ? 'w-56' : 'w-[54px]',
      )}
    >
      <div
        className={cn(
          'flex h-full flex-col gap-4 px-3 pb-3',
          variant === DashboardView.expanded ? 'pb-0' : '',
        )}
      >
        <SidebarHeader hideToggleIcon={isSettingsPage} />

        <div className="flex flex-1 flex-col gap-6 overflow-hidden ">
          {isSettingsPage ? <BackButton /> : null}

          <ScrollArea scrollHideDelay={500} scrollbarSize={8} type="hover">
            <div className="flex flex-col gap-4">
              <SidebarList section={items} />
            </div>
          </ScrollArea>
        </div>

        <div
          className={cn(
            'flex min-h-14 items-center border-t border-t-stone-300 py-1',
            // To make sure the height of the sidebar footer equals the height of the `StickyFooter` component
            variant === 'standard' ? 'mb-px' : '',
          )}
        >
          <UserDetailsButton user={user} />
        </div>
      </div>
    </aside>
  )
}
