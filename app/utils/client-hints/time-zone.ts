import { type ClientHint } from './utils'

export const clientHint = {
  cookieName: 'CH-time-zone',
  fallback: 'UTC',
  getValueCode: 'Intl.DateTimeFormat().resolvedOptions().timeZone',
} as const satisfies ClientHint<string>
