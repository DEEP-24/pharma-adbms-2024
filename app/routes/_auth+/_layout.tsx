import type { LoaderFunction } from '@remix-run/node'
import { Outlet } from '@remix-run/react'

import { validateUserRole } from '~/lib/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  await validateUserRole(request, null)
  return null
}

export default function AuthLayout() {
  return (
    <div className="relative grid h-screen w-full grid-cols-2">
      <div className="relative h-full overflow-hidden">
        <img
          alt="TR"
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1583088580009-2d947c3e90a6?q=80&w=1289&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      </div>

      <div className="relative h-full bg-gradient-to-b from-blue-500 via-slate-50 via-70% to-white">
        <div className="flex h-full items-center justify-center px-12 py-20">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
