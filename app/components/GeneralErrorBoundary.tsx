import {
  isRouteErrorResponse,
  useParams,
  useRouteError,
} from '@remix-run/react'
import { type ErrorResponse } from '@remix-run/router'

import { cn } from '~/utils/helpers'
import { getErrorMessage } from '~/utils/misc'

type StatusHandler = (info: {
  error: ErrorResponse
  params: Record<string, string | undefined>
}) => JSX.Element | null

type GeneralErrorBoundaryProps = {
  className?: string
  defaultStatusHandler?: StatusHandler
  statusHandlers?: Record<number, StatusHandler>
  unexpectedErrorHandler?: (error: unknown) => JSX.Element | null
}

export function GeneralErrorBoundary({
  className,
  defaultStatusHandler = ({ error }) => <DefaultStatusHandler error={error} />,
  statusHandlers,
  unexpectedErrorHandler = error => <p>{getErrorMessage(error)}</p>,
}: GeneralErrorBoundaryProps) {
  const error = useRouteError()
  const params = useParams()

  if (typeof document !== 'undefined') {
    console.error(error)
  }

  return (
    <div
      className={cn(
        'h-full w-full max-w-2xl px-4 md:max-w-3xl lg:max-w-5xl lg:px-4 xl:max-w-7xl',
        className,
      )}
    >
      {isRouteErrorResponse(error)
        ? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
            error,
            params,
          })
        : unexpectedErrorHandler(error)}
    </div>
  )
}

function DefaultStatusHandler({ error }: { error: ErrorResponse }) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-4xl font-semibold text-gray-800">{error.status}</h1>
      <p className="text-gray-600">{error.data}</p>
    </div>
  )
}
