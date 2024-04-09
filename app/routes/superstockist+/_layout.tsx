import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { LayoutDashboardIcon, PillIcon } from 'lucide-react'
import { $path } from 'remix-routes'
import { CommandMenu } from '~/components/command-menu'
import DashboardLayout from '~/components/layout/dashboard-layout'
import { MobileNavigationBar } from '~/components/mobile-navigation-bar'
import { Sidebar } from '~/components/sidebar/sidebar'
import { type SidebarListProps } from '~/components/sidebar/sidebar-list'
import { requireUserId, validateUserRole } from '~/lib/session.server'
import { useUser } from '~/utils/hooks/use-auth'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request)
  await validateUserRole(request, UserRole.SUPERSTOCKIST)

  return json({})
}

const menuItems = [
  {
    items: [
      {
        href: $path('/superstockist'),
        leftSlot: <LayoutDashboardIcon width={14} />,
        name: 'Overview',
      },
    ],
  },
  {
    title: 'Workspace',
    items: [
      {
        href: $path('/superstockist/medications'),
        leftSlot: <PillIcon width={14} />,
        name: 'Medications',
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
