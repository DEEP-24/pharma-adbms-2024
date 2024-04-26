import * as React from 'react'

type ReturnType<T> = [T, React.Dispatch<React.SetStateAction<T>>]
export function useLocalStorageState<T>({
  key,
  defaultValue,
}: {
  key: string
  defaultValue: T
}): ReturnType<T> {
  const [value, setValue] = React.useState<T>(defaultValue)

  React.useEffect(() => {
    const localStorageValue = window.localStorage.getItem(key)

    if (!localStorageValue) {
      setValue(defaultValue)
      return
    }

    setValue(JSON.parse(localStorageValue))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
