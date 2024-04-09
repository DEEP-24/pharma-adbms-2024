import { useParams } from '@remix-run/react'
import { $params, type RoutesWithParams } from 'remix-routes'

/**
 * This is a temporary workaround for not using `useParams` hook from Remix.
 * `remix-route` package doesn't support type inference for `useParams` hook.
 *
 * @see https://github.com/yesmeck/remix-routes/issues/80
 */
export function useSafeParams<TRoute extends keyof RoutesWithParams>(
  route: TRoute,
) {
  const params = $params(route, useParams())
  return params
}
