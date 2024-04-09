import { useRef, useState } from 'react'

import { Autocomplete, Loader } from '@mantine/core'

export function AutocompleteLoading() {
  const timeoutRef = useRef<number>(-1)
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<string[]>([])

  const handleChange = (val: string) => {
    window.clearTimeout(timeoutRef.current)
    setValue(val)
    setData([])

    if (val.trim().length === 0 || val.includes('@')) {
      setLoading(false)
    } else {
      setLoading(true)
      timeoutRef.current = window.setTimeout(() => {
        setLoading(false)
        setData(
          ['gmail.com', 'outlook.com', 'yahoo.com'].map(
            provider => `${val}@${provider}`,
          ),
        )
      }, 1000)
    }
  }
  return (
    <Autocomplete
      data={data}
      label="Async Autocomplete data"
      onChange={handleChange}
      placeholder="Your email"
      rightSection={loading ? <Loader size="1rem" /> : null}
      value={value}
    />
  )
}
