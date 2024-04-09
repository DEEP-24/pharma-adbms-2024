import * as React from 'react'

import { Loader } from '@mantine/core'

export function DefaultLoadingState() {
  return (
    <div className="flex items-center justify-center gap-3 py-4 text-center">
      <Loader size={14} /> Loading...
    </div>
  )
}
