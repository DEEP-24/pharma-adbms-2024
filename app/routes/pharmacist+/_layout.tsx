import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { LayoutDashboardIcon, PillIcon, Settings } from 'lucide-react'
import { $path } from 'remix-routes'

import { CommandMenu } from '~/components/command-menu'
import DashboardLayout from '~/components/layout/dashboard-layout'
import { MobileNavigationBar } from '~/components/mobile-navigation-bar'
import { Sidebar } from '~/components/sidebar/sidebar'
import { type SidebarListProps } from '~/components/sidebar/sidebar-list'
import { UserRole } from '~/enums'
import {
  getUserRole,
  isAdmin,
  isDoctor,
  isPatient,
  requireUserId,
  validateUserRole,
} from '~/lib/session.server'
import { useUser } from '~/utils/hooks/use-auth'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request)
  const userRole = await getUserRole(request)
  await validateUserRole(request, UserRole.PHARMACIST)

  if (!userId || !userRole) {
    return null
  }

  if (await isDoctor(request)) {
    return redirect('/pharmacist')
  } else if (await isAdmin(request)) {
    return redirect('/admin')
  } else if (await isPatient(request)) {
    return redirect('/patient')
  }

  return null
}
const menuItems = [
  {
    items: [
      {
        href: $path('/pharmacist'),
        leftSlot: <LayoutDashboardIcon width={14} />,
        name: 'Overview',
      },
    ],
  },
  {
    title: 'Manage',
    items: [
      {
        href: $path('/pharmacist/medications'),
        leftSlot: <PillIcon width={14} />,
        name: 'Medications',
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        href: $path('/pharmacist/settings'),
        leftSlot: <Settings width={14} />,
        name: 'profile',
      },
    ],
  },
] satisfies SidebarListProps[]

export default function DoctorLayout() {
  const user = useUser()

  return (
    <DashboardLayout
      bottomSlot={<MobileNavigationBar />}
      main={<Outlet />}
      nav={<Sidebar items={menuItems} user={user} />}
      topSlot={<CommandMenu />}
    />
  )
}
