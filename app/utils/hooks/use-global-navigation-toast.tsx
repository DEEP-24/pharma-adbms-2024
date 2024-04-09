import * as React from 'react'

import { useNavigation } from '@remix-run/react'
import { LoaderIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useSpinDelay } from 'spin-delay'

export function useGlobalNavigationToast() {
  const toastId = React.useRef<number | string>()
  const navigation = useNavigation()

  const isPending = useSpinDelay(
    !navigation.formMethod && navigation.state !== 'idle',
    {
      delay: 500,
      minDuration: 200,
    },
  )

  React.useEffect(() => {
    if (!isPending) {
      toast.dismiss(toastId.current)
      return
    }

    toastId.current = toast.info('Loading...', {
      icon: <LoaderIcon className="mr-4 size-4 animate-spin" />,
    })

    return
  }, [isPending])

  return null
}
