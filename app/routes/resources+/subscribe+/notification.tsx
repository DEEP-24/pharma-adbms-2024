import { type LoaderFunctionArgs } from '@remix-run/node'
import { eventStream } from 'remix-utils/sse/server'

import { type Message, emitter } from '~/lib/emitter.server'
import { EmitterEvent } from '~/utils/enums'

export async function loader({ request }: LoaderFunctionArgs) {
  return eventStream(request.signal, function setup(send) {
    function handleNotification(message: Message) {
      send({ event: message.event, data: message.id })
    }

    emitter.on(EmitterEvent.notify, handleNotification)

    return function clear() {
      emitter.off(EmitterEvent.notify, handleNotification)
    }
  })
}
