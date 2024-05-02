import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import {
  BookMinusIcon,
  LayoutDashboardIcon,
  NotepadTextIcon,
  Pill,
  Settings,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from 'lucide-react'
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
  isPharmacist,
  requireUserId,
  validateUserRole,
} from '~/lib/session.server'
import { useUser } from '~/utils/hooks/use-auth'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request)
  const userRole = await getUserRole(request)
  await validateUserRole(request, UserRole.PATIENT)

  if (!userRole) {
    return null
  }

  if (await isPharmacist(request)) {
    return redirect('/pharmacist')
  } else if (await isAdmin(request)) {
    return redirect('/admin')
  } else if (await isDoctor(request)) {
    return redirect('/doctor')
  }

  return null
}

const menuItems = [
  {
    items: [
      {
        href: $path('/patient'),
        leftSlot: <LayoutDashboardIcon width={14} />,
        name: 'Overview',
      },
    ],
  },
  {
    title: 'Appointments',
    items: [
      {
        href: $path('/patient/appointments'),
        leftSlot: <BookMinusIcon width={14} />,
        name: 'Appointments',
      },
    ],
  },
  {
    title: 'Medications',
    items: [
      {
        href: $path('/patient/medications'),
        leftSlot: <Pill width={14} />,
        name: 'Medications',
      },
    ],
  },
  {
    title: 'Prescriptions',
    items: [
      {
        href: $path('/patient/prescriptions'),
        leftSlot: <NotepadTextIcon width={14} />,
        name: 'Prescriptions',
      },
    ],
  },
  {
    title: 'Orders',
    items: [
      {
        href: $path('/patient/cart'),
        leftSlot: <ShoppingCartIcon width={14} />,
        name: 'Cart',
      },
      {
        href: $path('/patient/order-history'),
        leftSlot: <ShoppingBagIcon width={14} />,
        name: 'Order History',
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        href: $path('/patient/settings'),
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
