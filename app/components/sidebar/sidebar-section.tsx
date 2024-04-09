import { cn } from '~/utils/helpers'
import { useSidebarStore } from '~/utils/store/sidebar-store'

export const SidebarSection = ({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) => {
  const isSidebarOpen = useSidebarStore(state => state.isOpen)

  return (
    <div className="flex flex-col gap-1">
      {title ? (
        <p
          className={cn(
            'select-none overflow-hidden truncate text-[11px] font-semibold uppercase text-gray-400 transition-all duration-300',
            isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0',
          )}
        >
          {title}
        </p>
      ) : null}
      {children}
    </div>
  )
}
