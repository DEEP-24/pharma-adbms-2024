import { type RankingInfo, rankItem } from '@tanstack/match-sorter-utils'
import { type FilterFn } from '@tanstack/react-table'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
    isWithinDateRange: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    options?: {
      label: string
      value: string
    }[]
  }
}

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

export const isWithinDateRangeFilter: FilterFn<any> = (
  row,
  columnId,
  value,
) => {
  const date = row.getValue(columnId)

  if (!(date instanceof Date)) {
    return false
  }

  const [start, end] = value

  if ((start || end) && !date) return false
  if (start && !end) {
    return date.getTime() >= start.getTime()
  } else if (!start && end) {
    return date.getTime() <= end.getTime()
  } else if (start && end) {
    return date.getTime() >= start.getTime() && date.getTime() <= end.getTime()
  } else return true
}
