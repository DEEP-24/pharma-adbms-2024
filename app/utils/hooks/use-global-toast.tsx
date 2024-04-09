import * as React from 'react'

import { type ToastMessage } from 'remix-toast'
import { toast as showToast } from 'sonner'

export function useGlobalToast({ toast }: { toast?: ToastMessage }) {
  React.useEffect(() => {
    if (toast) {
      setTimeout(() => {
        showToast[toast.type](toast.message)
      }, 0)
    }
  }, [toast])

  return null
}
