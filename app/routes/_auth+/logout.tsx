import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { $path } from 'remix-routes'

import { logout } from '~/lib/session.server'

export const action: ActionFunction = async ({ request }) => {
  return logout(request)
}

export const loader: LoaderFunction = async () => {
  return redirect($path('/login'))
}
