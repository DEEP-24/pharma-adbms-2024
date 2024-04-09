import { type LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { LayoutDashboardIcon, Users2Icon } from 'lucide-react'

import { CommandMenu } from '~/components/command-menu'
import DashboardLayout from '~/components/layout/dashboard-layout'
import { MobileNavigationBar } from '~/components/mobile-navigation-bar'
import { Sidebar } from '~/components/sidebar/sidebar'
import { type SidebarListProps } from '~/components/sidebar/sidebar-list'
import { UserRole } from '~/enums'
import {
  getUserId,
  getUserRole,
  isAdmin,
  isDoctor,
  isPatient,
  isPharmacist,
  validateUserRole,
} from '~/lib/session.server'
import { useUser } from '~/utils/hooks/use-auth'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)
  const userRole = await getUserRole(request)
  await validateUserRole(request, UserRole.DOCTOR)

  if (!userId || !userRole) {
    return null
  }

  if (await isPharmacist(request)) {
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
        href: '/doctor',
        leftSlot: <LayoutDashboardIcon width={14} />,
        name: 'Overview',
      },
    ],
  },
  {
    title: 'Appointments',
    items: [
      {
        href: '/doctor/appointments',
        leftSlot: <Users2Icon width={14} />,
        name: 'Today',
      },
      {
        end: false,
        href: '/doctor/appointments/previous',
        leftSlot: <Users2Icon width={14} />,
        name: 'Previous',
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
