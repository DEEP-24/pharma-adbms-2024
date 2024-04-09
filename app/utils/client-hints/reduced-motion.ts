import { type ClientHint } from './utils'

export const clientHint = {
  cookieName: 'CH-reduced-motion',
  fallback: 'no-preference',
  getValueCode: `window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduce' : 'no-preference'`,
  transform(value: null | string) {
    return value === 'reduce' ? 'reduce' : 'no-preference'
  },
} as const satisfies ClientHint<'no-preference' | 'reduce'>

/**
 * Subscribe to changes in the user's motion preference. Optionally pass
 * in a cookie name to use for the cookie that will be set if different from the
 * default.
 */
export function subscribeToMotionChange(
  subscriber: (value: 'no-preference' | 'reduce') => void,
  cookieName: string = clientHint.cookieName,
) {
  const motionMatch = window.matchMedia('(prefers-reduced-motion: reduce)')
  function handleMotionChange() {
    const value = motionMatch.matches ? 'reduce' : 'no-preference'
    document.cookie = `${cookieName}=${value}; Max-Age=31536000; Path=/`
    subscriber(value)
  }
  motionMatch.addEventListener('change', handleMotionChange)
  return function cleanupMotionChange() {
    motionMatch.removeEventListener('change', handleMotionChange)
  }
}
