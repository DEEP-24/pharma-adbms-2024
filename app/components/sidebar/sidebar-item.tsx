import React from 'react'

import { NavLink, useLocation } from '@remix-run/react'

import { Button } from '~/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { cn } from '~/utils/helpers'
import { useSidebarStore } from '~/utils/store/sidebar-store'

export type SidebarItemProps = {
  leftSlot?: React.ReactNode
  name: string
  rightSlot?: React.ReactNode
  type?: 'button' | 'link'
} & (
  | {
      end?: boolean
      href: string
      type?: 'link'
    }
  | {
      href?: never
      onClick?: () => void
      type: 'button'
    }
)

function TooltipWrapper({
  children,
  disable = false,
  label,
}: {
  children: React.ReactNode
  disable?: boolean
  label: string
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100} open={disable ? false : undefined}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        {!disable ? (
          <TooltipContent side="right">{label}</TooltipContent>
        ) : null}
      </Tooltip>
    </TooltipProvider>
  )
}

export function SidebarItem(props: SidebarItemProps) {
  const isSidebarOpen = useSidebarStore(state => state.isOpen)
  const location = useLocation()
  const { leftSlot, name, rightSlot, type } = props

  const renderItem = () => {
    if (type === 'button') {
      return (
        <Button onClick={() => props.onClick?.()} variant="unstyled">
          <BaseSideItem
            isSidebarOpen={isSidebarOpen}
            leftSlot={leftSlot}
            name={name}
            rightSlot={rightSlot}
          />
        </Button>
      )
    }

    return (
      <Button asChild variant="unstyled">
        <NavLink
          end={props.end ?? true}
          prefetch="intent"
          state={{
            from: location.pathname,
          }}
          to={props.href}
        >
          {({ isActive }) => (
            <BaseSideItem
              isActive={isActive}
              isSidebarOpen={isSidebarOpen}
              leftSlot={leftSlot}
              name={name}
              rightSlot={rightSlot}
            />
          )}
        </NavLink>
      </Button>
    )
  }

  return (
    <TooltipWrapper disable={isSidebarOpen} label={name}>
      {renderItem()}
    </TooltipWrapper>
  )
}

type BaseSideItemProps = Pick<
  SidebarItemProps,
  'leftSlot' | 'name' | 'rightSlot'
> & {
  isActive?: boolean
  isSidebarOpen?: boolean
}

function BaseSideItem({
  isActive,
  isSidebarOpen,
  leftSlot,
  name,
  rightSlot,
}: BaseSideItemProps) {
  return (
    <div
      className={cn(
        'relative flex w-full items-center gap-2 rounded-md py-px pl-2',
        'transition-all duration-150 ease-in-out',
        'text-black hover:bg-stone-300/50',
        isActive ? 'bg-stone-300/50 ' : null,
      )}
    >
      <div
        className={cn(
          'shrink-0 transition-all duration-300',
          isSidebarOpen ? '' : 'scale-110',
        )}
      >
        {leftSlot}
      </div>

      <div
        className={cn(
          'flex flex-1 items-center justify-between gap-2 overflow-hidden',
          isSidebarOpen ? 'w-auto' : 'hidden w-0',
        )}
      >
        <span
          className={cn(
            'flex-1 whitespace-nowrap text-xsm font-normal',
            isSidebarOpen ? 'inline-block' : 'hidden',
          )}
        >
          {name}
        </span>

        <div>{rightSlot}</div>
      </div>
    </div>
  )
}
