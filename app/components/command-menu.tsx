import { useHotkeys } from '@mantine/hooks'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import { useCommandMenuStore } from '~/utils/store/commandbar-store'
import { useSidebarStore } from '~/utils/store/sidebar-store'

export function CommandMenu() {
  const isOpen = useCommandMenuStore(state => state.isOpen)
  const toggleCommandMenu = useCommandMenuStore(state => state.toggle)
  const toggleSidebar = useSidebarStore(state => state.toggle)

  // If you do not want to ignore hotkeys events on any element
  // add `[]` as the second argument to useHotkeys
  // @example
  // `useHotkeys(['mod+K', () => toggleCommandMenu()], [])`
  useHotkeys([['mod+K', () => toggleCommandMenu()]])

  return (
    <CommandDialog modal onOpenChange={() => toggleCommandMenu()} open={isOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              toggleSidebar()
              toggleCommandMenu(false)
            }}
          >
            <span>Toggle Sidebar</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => toggleCommandMenu(false)}>
            <span>Configuration</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
