import * as React from 'react'

import { useRevalidator } from '@remix-run/react'
import { $path } from 'remix-routes'
import { useEventSource } from 'remix-utils/sse/react'

import { EmitterEvent } from '~/utils/enums'

type UseEventSubscriptionOptions = {
  event: EmitterEvent
  onUpdate?: (messageId: string) => void
  revalidateOnUpdate?: boolean
}

export function useEventSubscribtion({
  event,
  onUpdate,
  revalidateOnUpdate = true,
}: UseEventSubscriptionOptions) {
  const revalidator = useRevalidator()

  let lastMessageId = useEventSource(
    $path('/resources/subscribe/notification'),
    {
      event,
    },
  )

  const callbackRef = React.useRef(onUpdate)

  React.useEffect(() => {
    callbackRef.current = onUpdate
  }, [onUpdate])

  React.useEffect(() => {
    if (!lastMessageId) return

    if (revalidateOnUpdate) {
      revalidator.revalidate()
    }

    if (callbackRef.current) {
      callbackRef.current(lastMessageId)
    }
    // `Revalidator` is not memoized, so we don't need to include it in the deps array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessageId, revalidateOnUpdate])

  return lastMessageId
}

export const useNotifcationSubscription = (
  opts: Omit<UseEventSubscriptionOptions, 'api' | 'event'>,
) => {
  return useEventSubscribtion({
    event: EmitterEvent.newNotification,
    ...opts,
  })
}

export const useMedicationSubscription = (
  opts: Omit<UseEventSubscriptionOptions, 'api' | 'event'>,
) => {
  return useEventSubscribtion({
    event: EmitterEvent.newMedication,
    ...opts,
  })
}
