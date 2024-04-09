import * as React from 'react'

import {
  ActionIcon,
  type ActionIconProps,
  createPolymorphicComponent,
} from '@mantine/core'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { cn } from '~/utils/helpers'

interface ActionIconButtonProps extends ActionIconProps {
  children: React.ReactNode
  tooltipLabel?: React.ReactNode
}

export const ActionIconButton = createPolymorphicComponent<
  'button',
  ActionIconButtonProps
>(
  // eslint-disable-next-line react/display-name
  React.forwardRef<HTMLButtonElement, ActionIconButtonProps>((props, ref) => {
    const { children, className, tooltipLabel, ...others } = props
    const content = (
      <ActionIcon
        className={cn('transition-opacity ease-in-out', className)}
        color="gray"
        size="md"
        variant="subtle"
        {...others}
        ref={ref}
      >
        {children}
      </ActionIcon>
    )

    if (tooltipLabel) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{tooltipLabel}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    } else {
      return content
    }
  }),
)
