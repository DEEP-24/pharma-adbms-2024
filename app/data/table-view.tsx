import { type TableState } from '@tanstack/react-table'

export const INITIAL_TABLE_STATE = {
  columnFilters: [],
  columnOrder: [],
  columnPinning: {
    left: [],
    right: [],
  },
  columnSizing: {},
  columnSizingInfo: {
    columnSizingStart: [],
    deltaOffset: null,
    deltaPercentage: null,
    isResizingColumn: false,
    startOffset: null,
    startSize: null,
  },
  columnVisibility: {},
  expanded: {},
  globalFilter: undefined,
  grouping: [],
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  rowPinning: {
    bottom: [],
    top: [],
  },
  rowSelection: {},
  sorting: [],
} satisfies TableState
