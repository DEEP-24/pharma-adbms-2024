import * as React from 'react'

import { Loader, Select } from '@mantine/core'
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
  // const query = searchParams.get('q')

  // if (!query) {
  //   return json(null)
  // }

  const medicines = await db.medication.findMany({
    select: {
      id: true,
      brand: true,
      dosage: true,
      name: true,
      unit: true,
      price: true,
      quantity: true,
      prescriptionRequired: true,
    },
    // take: 10,
    // where: {
    //   AND: [
    //     // {
    //     //   name: {
    //     //     contains: query,
    //     //     mode: 'insensitive',
    //     //   },
    //     // },
    //     {
    //       prescriptionRequired: true,
    //     },
    //   ],
    // },
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
  const medicinesFetcher = useFetcherCallback<typeof loader>()

  React.useEffect(() => {
    medicinesFetcher.load(SEARCH_MEDICATION_ROUTE)
  }, [])

  const medicines = medicinesFetcher.data?.medicines ?? []

  const { placeholder = 'Search', className } = props

  const [open, setOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<
    (typeof medicines)[number] | undefined
  >(props.value)

  const onChangeRef = React.useRef(props.onChange)
  React.useEffect(() => {
    onChangeRef.current = props.onChange
  })

  const handleSelect = (item?: (typeof medicines)[number]) => {
    setOpen(false)
    onChangeRef.current?.(item)
    setSelectedItem(item)
  }

  React.useEffect(() => {
    setSelectedItem(props.value)
  }, [props.value])

  return (
    <Popover
      onOpenChange={open => {
        setOpen(open)
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
        <Select
          data={medicines.map(medicine => {
            let label = medicine.name

            if (medicine.prescriptionRequired) {
              label = `${label} (Prescription Required)`
            }
            return {
              label,
              value: medicine.id,
            }
          })}
          value={selectedItem?.id}
          placeholder="Click to see the list"
          onChange={value => {
            const item = medicines.find(medicine => medicine.id === value)
            handleSelect(item)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
