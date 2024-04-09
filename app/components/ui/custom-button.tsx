import * as React from 'react'

import {
  Button,
  type ButtonProps,
  createPolymorphicComponent,
} from '@mantine/core'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { cn } from '~/utils/helpers'

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode
  toolTipLabel?: React.ReactNode
}

export const CustomButton = createPolymorphicComponent<
  'button',
  CustomButtonProps
>(
  // eslint-disable-next-line react/display-name
  React.forwardRef<HTMLButtonElement, CustomButtonProps>((props, ref) => {
    const { children, className, toolTipLabel, ...others } = props
    const content = (
      <Button
        className={cn('h-7 rounded font-medium', className)}
        color="dark"
        loaderProps={{
          size: 14,
          type: 'dots',
        }}
        size="sm"
        variant="filled"
        {...others}
        ref={ref}
      >
        {children}
      </Button>
    )

    if (toolTipLabel) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{toolTipLabel}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    } else {
      return content
    }
  }),
)
