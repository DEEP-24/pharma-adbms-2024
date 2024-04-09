import * as React from 'react'

import { NumberInput, TextInput } from '@mantine/core'
import { type Column, type Table } from '@tanstack/react-table'

export function DataTableFIlterInput<TData, TValue>({
  column,
  table,
}: {
  column: Column<TData, TValue>
  table: Table<TData>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const renderColumnFilter = () => {
    if (typeof firstValue === 'number') {
      return (
        <div>
          <div className="flex space-x-2">
            <DebouncedInput
              className="w-24 rounded border shadow"
              max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
              min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
              onChange={value =>
                column.setFilterValue((old: [number, number]) => [
                  value,
                  old?.[1],
                ])
              }
              placeholder={`Min ${
                column.getFacetedMinMaxValues()?.[0]
                  ? `(${column.getFacetedMinMaxValues()?.[0]})`
                  : ''
              }`}
              type="number"
              value={(columnFilterValue as [number, number])?.[0] ?? ''}
            />
            <DebouncedInput
              className="w-24 rounded border shadow"
              max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
              min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
              onChange={value =>
                column.setFilterValue((old: [number, number]) => [
                  old?.[0],
                  value,
                ])
              }
              placeholder={`Max ${
                column.getFacetedMinMaxValues()?.[1]
                  ? `(${column.getFacetedMinMaxValues()?.[1]})`
                  : ''
              }`}
              type="number"
              value={(columnFilterValue as [number, number])?.[1] ?? ''}
            />
          </div>
          <div className="h-1" />
        </div>
      )
    }

    return (
      <DebouncedInput
        onChange={value => column.setFilterValue(value)}
        placeholder={`Search... `}
        type="text"
        value={(columnFilterValue ?? '') as string}
      />
    )
  }

  return <>{renderColumnFilter()}</>
}

interface DebouncedInputProps {
  className?: string
  debounce?: number
  max?: number
  min?: number
  onChange: (value: number | string) => void
  placeholder?: string
  type?: 'number' | 'text'
  value: number | string
}

const DebouncedInput: React.FC<DebouncedInputProps> = ({
  debounce = 300,
  onChange: onChangeProp,
  type = 'text',
  value: initialValue,
  ...props
}) => {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChange = React.useCallback(onChangeProp, [])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  if (type === 'number') {
    return (
      <NumberInput
        {...props}
        onChange={num => setValue(num)}
        value={value as number}
      />
    )
  }

  return (
    <TextInput
      {...props}
      onChange={e => setValue(e.target.value)}
      value={value as string}
    />
  )
}
