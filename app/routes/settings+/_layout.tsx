import { type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { CogIcon } from 'lucide-react'
import { CommandMenu } from '~/components/command-menu'
import DashboardLayout from '~/components/layout/dashboard-layout'
import { Sidebar } from '~/components/sidebar/sidebar'
import { type SidebarListProps } from '~/components/sidebar/sidebar-list'
import { UserRole } from '~/enums'
import {
  getUserRole,
  requireUserId,
  validateUserRole,
} from '~/lib/session.server'
import { useUser } from '~/utils/hooks/use-auth'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request)
  const userRole = await getUserRole(request)

  if (userRole === UserRole.ADMIN) {
    await validateUserRole(request, UserRole.ADMIN)
  } else if (userRole === UserRole.DOCTOR) {
    await validateUserRole(request, UserRole.DOCTOR)
  } else if (userRole === UserRole.PATIENT) {
    await validateUserRole(request, UserRole.PATIENT)
  } else if (userRole === UserRole.PHARMACIST) {
    await validateUserRole(request, UserRole.PHARMACIST)
  }

  if (!userId || !userRole) {
    return null
  }

  return null
}

const menuItems: SidebarListProps[] = [
  {
    items: [
      {
        href: '/settings',
        leftSlot: <CogIcon width={16} />,
        name: 'Profile',
      },
    ],
  },
]

export default function SettingsLayout() {
  const user = useUser()

  return (
    <DashboardLayout
      main={<Outlet />}
      nav={<Sidebar items={menuItems} user={user} />}
      topSlot={<CommandMenu />}
    />
  )
}
