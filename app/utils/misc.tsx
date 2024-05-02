import * as React from 'react'

import ObjectID from 'bson-objectid'
import { UserRole } from '~/enums'

export function round(number: number, precision: number) {
  const d = Math.pow(10, precision)
  return Math.round((number + Number.EPSILON) * d) / d
}

export function titleCase(string: string) {
  string = string.toLowerCase()
  const wordsArray = string.split(' ')

  for (var i = 0; i < wordsArray.length; i++) {
    wordsArray[i] =
      wordsArray[i].charAt(0).toUpperCase() + wordsArray[i].slice(1)
  }

  return wordsArray.join(' ')
}

export function upperCase(string: string) {
  return string.toUpperCase()
}

export function formatCurrency(number: number) {
  return new Intl.NumberFormat('en-IN', {
    currency: 'USD',
    style: 'currency',
  }).format(number)
}

export function formatList(list: string[], opts?: Intl.ListFormatOptions) {
  return new Intl.ListFormat('en-US', {
    style: 'narrow',
    type: 'conjunction',
    ...opts,
  }).format(list)
}

export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }
  console.error('Unable to get error message for error', error)
  return 'Unknown Error'
}

export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
) {
  if (typeof date === 'string') {
    date = new Date(date)
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeZone: 'America/New_York',
    ...options,
  }).format(date)
}

export function calculateAge(dateString: string): number {
  const today = new Date()
  const birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--
  }
  return age
}

export function getInitials(name: string): string {
  const nameParts = name.split(/[^a-zA-Z]+/)
  let initials = ''

  for (const part of nameParts) {
    if (part.length > 0) {
      initials += part[0]
    }

    if (initials.length >= 2) {
      break
    }
  }

  return initials.toUpperCase()
}

/**
 * Combine multiple header objects into one (uses append so headers are not overridden)
 */
export function combineHeaders(
  ...headers: Array<ResponseInit['headers'] | null | undefined>
) {
  const combined = new Headers()
  for (const header of headers) {
    if (!header) continue
    for (const [key, value] of new Headers(header).entries()) {
      combined.append(key, value)
    }
  }
  return combined
}

export function noop() {}

export function useUpdateQueryStringValueWithoutNavigation(
  queryKey: string,
  queryValue: string,
) {
  React.useEffect(() => {
    const currentSearchParams = new URLSearchParams(window.location.search)
    const oldQuery = currentSearchParams.get(queryKey) ?? ''
    if (queryValue === oldQuery) return

    if (queryValue) {
      currentSearchParams.set(queryKey, queryValue)
    } else {
      currentSearchParams.delete(queryKey)
    }
    const newUrl = [window.location.pathname, currentSearchParams.toString()]
      .filter(Boolean)
      .join('?')
    // alright, let's talk about this...
    // Normally with remix, you'd update the params via useSearchParams from react-router-dom
    // and updating the search params will trigger the search to update for you.
    // However, it also triggers a navigation to the new url, which will trigger
    // the loader to run which we do not want because all our data is already
    // on the client and we're just doing client-side filtering of data we
    // already have. So we manually call `window.history.pushState` to avoid
    // the router from triggering the loader.
    window.history.replaceState(null, '', newUrl)
  }, [queryKey, queryValue])
}

export const createId = () => {
  return ObjectID().toString()
}

/**
 * Convert a date to a relative time string, such as
 * "a minute ago", "in 2 hours", "yesterday", "3 months ago", etc.
 * using Intl.RelativeTimeFormat
 */
export function getRelativeTimeString(
  date: Date | number | string,
  lang?: string,
): string {
  // Set a fallback language
  const fallbackLang = 'en-US'

  if (typeof date === 'string') {
    date = new Date(date)
  }

  // Allow dates or times to be passed
  const timeMs = typeof date === 'number' ? date : date.getTime()

  // Get the amount of seconds between the given date and now
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000)

  // Array reprsenting one minute, hour, day, week, month, etc in seconds
  const cutoffs = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ]

  // Array equivalent to the above but in the string representation of the units
  const units: Intl.RelativeTimeFormatUnit[] = [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'year',
  ]

  // Grab the ideal cutoff unit
  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds))

  // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
  // is one day in seconds, so we can divide our seconds by this to get the # of days
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1

  // Use provided language or fallback language
  const selectedLang = lang || fallbackLang

  // Intl.RelativeTimeFormat do its magic
  const rtf = new Intl.RelativeTimeFormat(selectedLang, { numeric: 'auto' })
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex])
}

export function callAll<Args extends Array<unknown>>(
  ...fns: Array<((...args: Args) => unknown) | undefined>
) {
  return (...args: Args) => fns.forEach(fn => fn?.(...args))
}

export function isValidDateOrDateString(value: unknown): value is Date {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return true
  }

  if (typeof value === 'string') {
    const date = new Date(value)
    return !isNaN(date.getTime())
  }

  return false
}

export function generateFccId(id: string) {
  return `TR-1284-${id}`
}

/**
 * Temporary fix for `remix-typedjson` not being able to handle `Dates`
 * @see https://github.com/kiliman/remix-typedjson/issues/36#issue-1996299309
 *
 * @param value - The value to be fixed
 * @returns Validated and formatted date
 * @throws When the input value is not a valid date
 */
export function remixTypedJsonDateFix(value: NonNullable<Date | string>): Date {
  const isValid = isValidDateOrDateString(value)

  if (!isValid) {
    throw new Error('Invalid date: Please input a valid date or date string.')
  }

  if (value instanceof Date) {
    return value
  }

  return new Date(value)
}

export function getNameWithPrefix(name?: string, prefix?: null | string) {
  return prefix ? `${prefix} ${name}` : name
}

export const formatDateForPrismaFilter = (date: Date) => {
  const formattedDate =
    date.getFullYear() +
    '-' +
    (date.getMonth() < 9 ? '0' : '') +
    (date.getMonth() + 1) +
    '-' +
    (date.getDate() < 10 ? '0' : '') +
    date.getDate()

  return formattedDate
}

export function removeTrailingSlash(s: string) {
  return s.endsWith('/') ? s.slice(0, -1) : s
}

export const userRoleLabelLookup = {
  ADMIN: 'Admin',
  PATIENT: 'Patient',
  DOCTOR: 'Doctor',
  PHARMACIST: 'Pharmacist',
} satisfies Record<UserRole, string>
