import * as React from 'react'

import { useBlocker } from '@remix-run/react'
import { type Blocker } from '@remix-run/react'
import { create } from 'zustand'

import { Button } from '~/components/ui/button'
import { CustomModal } from '~/components/ui/custom-modal'

interface NavigationBlockerStore {
  blocker?: Blocker
  isOpen: boolean
  setBlocker: (blocker: Blocker | null) => void
}

const useNavigationBlockerStore = create<NavigationBlockerStore>()(
  (set, _) => ({
    blocker: undefined,
    isOpen: true,
    setBlocker: blocker => {
      set({
        blocker: blocker ?? undefined,
      })
    },
  }),
)

export function useNavigationBlocker({
  condition,
}: {
  condition: (() => boolean) | boolean
}) {
  const setBlocker = useNavigationBlockerStore(state => state.setBlocker)

  const _condition = typeof condition === 'function' ? condition() : condition

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      _condition && currentLocation.pathname !== nextLocation.pathname,
  )
  React.useEffect(() => {
    if (blocker) {
      setBlocker(blocker)
    }

    return () => {
      setBlocker(null)
    }
  }, [setBlocker, blocker])
}

export function GlobalBlockerModal() {
  const blocker = useNavigationBlockerStore(state => state.blocker)

  return (
    <CustomModal
      footerSection={
        <div className="flex items-center justify-end gap-4">
          <Button
            className="h-7 px-3 font-normal text-gray-500"
            onClick={() => {
              blocker?.reset?.()
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="h-7"
            onClick={() => {
              blocker?.proceed?.()
            }}
            variant="destructive"
          >
            Discard
          </Button>
        </div>
      }
      onClose={() => blocker?.reset?.()}
      open={blocker?.state === 'blocked'}
      title="Are you sure?"
    >
      <p>You have unsaved changes. Are you sure you want to discard them?</p>
    </CustomModal>
  )
}
