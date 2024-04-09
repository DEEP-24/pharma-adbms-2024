import * as React from 'react'

import { TextInput } from '@mantine/core'
import { useHotkeys } from '@mantine/hooks'
import { type Table } from '@tanstack/react-table'
import { SearchIcon } from 'lucide-react'

import { useDebounce } from '~/utils/hooks/use-debounce'

interface GlobalSearchFilterProps<TData> {
  className?: string
  debounceTimeout?: number
  initialValue?: string
  table: Table<TData>
}

export function GlobalSearchFilter<TData>({
  className,
  debounceTimeout = 300,
  initialValue = '',
  table,
}: GlobalSearchFilterProps<TData>) {
  const [inputValue, setInputValue] = React.useState(
    table.getState().globalFilter || initialValue,
  )
  const inputRef = React.useRef<React.ElementRef<'input'>>(null)
  const currentGlobalFilter = table.getState().globalFilter

  const debouncedAction = useDebounce((val: string) => {
    table.setGlobalFilter(val)
  }, debounceTimeout)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value)
    debouncedAction(event.currentTarget.value)
  }

  React.useEffect(() => {
    const currentFilter = currentGlobalFilter || ''
    if (currentFilter !== inputValue) {
      setInputValue(currentFilter)
    }

    // TODO: Fix this logic later
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGlobalFilter])

  useHotkeys([['/', () => inputRef.current?.focus()]])

  return (
    <TextInput
      className={className}
      classNames={{
        input: 'text-sm',
      }}
      leftSection={<SearchIcon size={14} />}
      leftSectionPointerEvents="none"
      onChange={onChange}
      placeholder="Search..."
      ref={inputRef}
      type="search"
      value={inputValue}
      variant="unstyled"
    />
  )
}
