import { type LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import {
  AreaChartIcon,
  LayoutDashboardIcon,
  PillIcon,
  Users2Icon,
} from 'lucide-react'

import { CommandMenu } from '~/components/command-menu'
import DashboardLayout from '~/components/layout/dashboard-layout'
import { MobileNavigationBar } from '~/components/mobile-navigation-bar'
import { Sidebar } from '~/components/sidebar/sidebar'
import { type SidebarListProps } from '~/components/sidebar/sidebar-list'
import { UserRole } from '~/enums'
import {
  getUserId,
  getUserRole,
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
  } else if (await isDoctor(request)) {
    return redirect('/doctor')
  } else if (await isPatient(request)) {
    return redirect('/patient')
  }

  return null
}

const menuItems = [
  {
    items: [
      {
        href: '/cp',
        leftSlot: <LayoutDashboardIcon width={14} />,
        name: 'Overview',
      },
      {
        href: '/cp/analytics',
        leftSlot: <AreaChartIcon width={14} />,
        name: 'Analytics',
      },
    ],
  },
  {
    title: 'Manage',
    items: [
      {
        href: '/cp/medications',
        leftSlot: <PillIcon width={14} />,
        name: 'Medications',
      },

      {
        end: false,
        href: '/cp/patients',
        leftSlot: <Users2Icon width={14} />,
        name: 'Patients',
      },
    ],
  },
] satisfies SidebarListProps[]

export default function AdminLayout() {
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
