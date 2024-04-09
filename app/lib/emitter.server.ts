import { remember } from '@epic-web/remember'
import { EventEmitter } from 'node:events'

import { EmitterEvent } from '~/utils/enums'
import { cuid } from '~/utils/misc'

export type Message = {
  event: EmitterEvent
  id: string
}

export const emitter = remember('emitter', () => new EventEmitter())

export const emitEvent = (event: EmitterEvent, data?: string) => {
  return emitter.emit(EmitterEvent.notify, {
    event,
    id: data || cuid(),
  })
}
