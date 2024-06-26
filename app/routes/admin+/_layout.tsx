import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import {
  LayoutDashboardIcon,
  PillIcon,
  Settings,
  Users2Icon,
} from 'lucide-react'
import { $path } from 'remix-routes'

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
  await validateUserRole(request, UserRole.ADMIN)

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
        href: '/admin',
        leftSlot: <LayoutDashboardIcon width={14} />,
        name: 'Overview',
      },
    ],
  },
  {
    title: 'Manage',
    items: [
      {
        href: $path('/admin/medications'),
        leftSlot: <PillIcon width={14} />,
        name: 'Medications',
      },
      {
        end: false,
        href: $path('/admin/patients'),
        leftSlot: <Users2Icon width={14} />,
        name: 'Patients',
      },
      {
        end: false,
        href: $path('/admin/doctors'),
        leftSlot: <Users2Icon width={14} />,
        name: 'Doctors',
      },
      {
        end: false,
        href: $path('/admin/pharmacists'),
        leftSlot: <Users2Icon width={14} />,
        name: 'Pharmacists',
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        href: $path('/admin/settings'),
        leftSlot: <Settings width={14} />,
        name: 'profile',
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
