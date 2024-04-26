import * as React from 'react'

import { Loader } from '@mantine/core'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { useSpinDelay } from 'spin-delay'

import { Button } from '~/components/ui/button'
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { db } from '~/lib/db.server'
import { cn } from '~/utils/helpers'
import { useDebounce } from '~/utils/hooks/use-debounce'
import { useFetcherCallback } from '~/utils/hooks/use-fetcher-callback'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams
  const query = searchParams.get('q')

  if (!query) {
    return json(null)
  }

  const medicines = await db.medication.findMany({
    select: {
      id: true,
      brand: true,
      dosage: true,
      name: true,
      unit: true,
    },
    take: 10,
    where: {
      AND: [
        {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          prescriptionRequired: true,
        },
      ],
    },
  })

  return json({
    medicines,
    success: true,
  })
}

const SEARCH_MEDICATION_ROUTE = '/resources/search-medication'
const SEARCH_MEDICATION_FORM_ID = 'search-medication-form'

type UseMedicineSearchProps = {
  debounceTime?: number
  minChars?: number
}

export function useMedicineSearch(props: UseMedicineSearchProps) {
  const { debounceTime = 300, minChars = 3 } = props
  const searchFetcher = useFetcherCallback<typeof loader>({
    key: SEARCH_MEDICATION_FORM_ID,
  })

  const search = useDebounce((query: string) => {
    if (query.length < minChars) {
      return searchFetcher.reset()
    }

    return searchFetcher.load(`${SEARCH_MEDICATION_ROUTE}?q=${query}`)
  }, debounceTime)

  const isPending = useSpinDelay(searchFetcher.isPending, {
    delay: 150,
    minDuration: 300,
  })

  return {
    isInitialData: !searchFetcher.data,
    isPending,
    medicines: searchFetcher.data?.medicines ?? [],
    reset: searchFetcher.reset,
    search,
  }
}

export type MedicineComboboxItem = ReturnType<
  typeof useMedicineSearch
>['medicines'][number]

type MedicineComboboxProps = {
  className?: string
  inputProps?: {
    emptyState?: React.ReactNode
    placeholder?: string
  }
  onChange?: (value?: MedicineComboboxItem) => void
  placeholder?: string
  value?: MedicineComboboxItem
}

const DEFAULT_INPUT_PROPS = {
  emptyState: 'No item found.',
  placeholder: 'Search item...',
}
export function MedicineCombobox(props: MedicineComboboxProps) {
  const { placeholder = 'Search', className } = props
  const { isInitialData, isPending, medicines, reset, search } =
    useMedicineSearch({
      minChars: 3,
    })

  const [open, setOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<
    (typeof medicines)[number] | undefined
  >(props.value)
  const [query, setQuery] = React.useState('')

  const inputProps = { ...DEFAULT_INPUT_PROPS, ...props.inputProps }

  const onChangeRef = React.useRef(props.onChange)
  React.useEffect(() => {
    onChangeRef.current = props.onChange
  })

  const handleSelect = (item?: (typeof medicines)[number]) => {
    setQuery('')
    setOpen(false)
    reset()

    onChangeRef.current?.(item)
    setSelectedItem(item)
  }

  const isValidQuery = query.length >= 3
  const showNoResults =
    isValidQuery && !isPending && !isInitialData && medicines.length === 0
  const showMinimumCharsPrompt = !isValidQuery && !isPending && !selectedItem

  React.useEffect(() => {
    setSelectedItem(props.value)
  }, [props.value])

  return (
    <Popover
      onOpenChange={open => {
        setOpen(open)
        if (!open) {
          reset()
          setQuery('')
        }
      }}
      open={open}
    >
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn(
            'h-7 w-60 justify-between pl-3 pr-2 font-normal hover:bg-transparent',
            !selectedItem && 'text-gray-400 hover:text-gray-400',
            className,
          )}
          role="combobox"
          variant="outline"
        >
          {selectedItem ? selectedItem.name : placeholder}
          <ChevronDownIcon className="ml-2 shrink-0 text-gray-500" size={14} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cn('w-60 p-0', className)}>
        <Command>
          <CommandInput
            onValueChange={value => {
              setQuery(value)
              search(value)
            }}
            placeholder={inputProps.placeholder}
            value={query}
          />

          {showMinimumCharsPrompt ? (
            <div
              className={cn(
                'flex items-center justify-center px-1 py-2 text-center text-sm',
              )}
            >
              Please enter atleast 3 characters
            </div>
          ) : null}

          {showNoResults ? (
            <div
              className={cn(
                'flex items-center justify-center px-1 py-2 text-center text-sm',
              )}
            >
              {inputProps.emptyState}
            </div>
          ) : null}

          <CommandList>
            {isPending ? (
              <div
                className={cn(
                  'flex items-center justify-center px-1 py-2 text-center text-sm',
                )}
              >
                <Loader color="blue" size={16} />
              </div>
            ) : null}

            {selectedItem ? (
              <CommandItem
                className={cn(
                  'flex cursor-pointer items-center justify-start gap-2',
                  'cursor-pointer-none',
                )}
                onSelect={() => handleSelect()}
              >
                <CheckIcon className={cn('opacity-100')} size={16} />
                {selectedItem.name} - <i>Click to Remove</i>
              </CommandItem>
            ) : null}

            {isValidQuery &&
              medicines.map(medicine => {
                const isSelected =
                  medicine.name.toLowerCase() ===
                  selectedItem?.name?.toLowerCase()

                return (
                  <CommandItem
                    className={cn(
                      'flex cursor-pointer items-center justify-start gap-2',
                      isSelected ? 'cursor-pointer-none opacity-50' : '',
                    )}
                    disabled={isSelected}
                    key={medicine.id}
                    onSelect={val => {
                      const selectedMedicine = medicines.find(
                        medicine => medicine.name.toLowerCase() === val,
                      )

                      handleSelect(selectedMedicine)
                    }}
                    value={medicine.name}
                  >
                    <CheckIcon
                      className={cn(isSelected ? 'opacity-100' : 'opacity-0')}
                      size={16}
                    />
                    {medicine.name} ({medicine.dosage} {medicine.unit})
                  </CommandItem>
                )
              })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
