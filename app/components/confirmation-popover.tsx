import * as React from 'react'

import { Button } from '~/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'

type ConfirmationPopoverProps = {
  cancelLabel?: string
  children: React.ReactNode
  confirmLabel?: string
  onCancel?: () => void
  onConfirm: () => void
}

export const ConfirmationPopover = ({
  cancelLabel = 'Cancel',
  children,
  confirmLabel = 'Confirm',
  onCancel,
  onConfirm,
}: ConfirmationPopoverProps) => {
  const [isPopoverVisible, setIsPopoverVisible] = React.useState(false)

  return (
    <Popover onOpenChange={setIsPopoverVisible} open={isPopoverVisible}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent className="w-auto py-2" collisionPadding={16}>
        <div className="flex flex-col gap-4">
          <p>Are you sure?</p>

          <div className="flex items-center gap-4">
            <Button
              className="px-3 font-normal text-gray-500"
              onClick={() => {
                onCancel?.()
                setIsPopoverVisible(false)
              }}
              size="xs"
              variant="outline"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={() => {
                onConfirm()
                setIsPopoverVisible(false)
              }}
              size="xs"
              variant="destructive"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
