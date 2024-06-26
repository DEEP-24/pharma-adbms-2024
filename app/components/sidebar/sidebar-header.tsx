import { SidebarCloseIcon } from 'lucide-react'
import { ActionIconButton } from '~/components/ui/action-icon-button'
import appConfig from '~/config/app.config'
import { cn } from '~/utils/helpers'
import { useSidebarStore } from '~/utils/store/sidebar-store'

export function SidebarHeader({
  hideToggleIcon = false,
}: {
  hideToggleIcon?: boolean
}) {
  const toggleSidebar = useSidebarStore(state => state.toggle)
  const isSidebarOpen = useSidebarStore(state => state.isOpen)

  return (
    <div
      className={cn('flex min-h-header select-none items-center gap-2 pl-1.5')}
    >
      <div className="flex items-center justify-center gap-3">
        {isSidebarOpen ? (
          <div className={cn('mt-5 text-lg font-semibold text-white')}>
            {appConfig.appTitle}
          </div>
        ) : null}
      </div>
      <div
        className={cn(
          'ml-auto opacity-0 transition-opacity group-hover/sidebar:opacity-100',
          hideToggleIcon || !isSidebarOpen ? 'hidden' : 'block',
        )}
      >
        <ActionIconButton
          className="text-neutral-300"
          onClick={() => toggleSidebar()}
          tooltipLabel="Collapse sidebar"
        >
          <SidebarCloseIcon size={14} />
        </ActionIconButton>
      </div>
    </div>
  )
}
