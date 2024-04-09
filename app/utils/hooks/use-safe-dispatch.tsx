import * as React from 'react'

export function useSafeDispatch<Args extends Array<unknown>>(
  dispatch: (...args: Args) => unknown,
) {
  const ref = React.useRef(false)

  React.useEffect(() => {
    ref.current = true
    return () => {
      ref.current = false
    }
  }, [])

  return React.useCallback(
    (...args: Args) => {
      if (ref.current) {
        dispatch(...args)
      }
    },
    [dispatch],
  )
}
