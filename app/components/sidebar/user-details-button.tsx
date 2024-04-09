import { Avatar } from '@mantine/core'
import { useNavigate } from '@remix-run/react'

import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { cn } from '~/utils/helpers'
import { useAuth, useUser } from '~/utils/hooks/use-auth'
import { getInitials } from '~/utils/misc'
import { useSidebarStore } from '~/utils/store/sidebar-store'

export function UserDetailsButton({
  user,
}: {
  user: ReturnType<typeof useUser>
}) {
  const isSidebarOpen = useSidebarStore(state => state.isOpen)
  const { signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn('flex w-full items-center gap-2 ')}
          variant="unstyled"
        >
          <Avatar
            alt={`${user.name}'s avatar`}
            color="gray"
            radius="sm"
            size={32}
            src={undefined}
            variant="filled"
          >
            {getInitials(user.name)}
          </Avatar>

          <div className={cn(isSidebarOpen ? 'w-auto overflow-hidden' : 'w-0')}>
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-56"
        loop
        side="top"
        sideOffset={12}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="truncate text-sm font-medium leading-none">
              {user.name}
            </p>
            <p className="truncate text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => navigate('/settings')}
          textValue="Settings"
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer" onSelect={() => signOut()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
