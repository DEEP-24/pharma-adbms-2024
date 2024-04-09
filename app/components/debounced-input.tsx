import * as React from 'react'

import { TextInput, type TextInputProps } from '@mantine/core'
import { useDebounceCallback, useHotkeys } from '@mantine/hooks'

export function DebouncedInput({
  debounce = 500,
  onChange,
  value: initialValue,
  ...props
}: {
  debounce?: number
  onChange: (value: string) => void
  value: string
} & Omit<TextInputProps, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  const ref = React.useRef<HTMLInputElement>(null)

  useHotkeys([['/', () => ref.current?.focus()]])

  const debouncedOnChange = useDebounceCallback(() => onChange(value), debounce)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <TextInput
      ref={ref}
      {...props}
      onChange={e => {
        setValue(e.target.value)
        debouncedOnChange()
      }}
      value={value}
    />
  )
}

// interface DebouncedInputProps {
//   value: string | number
//   onChange: (value: string | number) => void
//   debounce?: number
//   type?: 'text' | 'number'
//   placeholder?: string
//   className?: string
//   min?: number
//   max?: number
// }

// const DebouncedInput: React.FC<DebouncedInputProps> = ({
//   value: initialValue,
//   onChange: onChangeProp,
//   debounce = 300,
//   type = 'text',
//   ...props
// }) => {
//   const [value, setValue] = React.useState(initialValue)

//   React.useEffect(() => {
//     setValue(initialValue)
//   }, [initialValue])

//   const onChange = React.useCallback(onChangeProp, [])

//   React.useEffect(() => {
//     const timeout = setTimeout(() => {
//       onChange(value)
//     }, debounce)

//     return () => clearTimeout(timeout)
//   }, [value, debounce, onChange])

//   if (type === 'number') {
//     return (
//       <NumberInput
//         {...props}
//         value={value as number}
//         onChange={num => setValue(num)}
//       />
//     )
//   }

//   return (
//     <TextInput
//       {...props}
//       value={value as string}
//       onChange={e => setValue(e.target.value)}
//     />
//   )
// }
