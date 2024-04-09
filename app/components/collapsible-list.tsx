import * as React from 'react'

import { Collapse, type CollapseProps } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ChevronsDown, ChevronsUp } from 'lucide-react'

import { ActionIconButton } from '~/components/ui/action-icon-button'
import { cn } from '~/utils/helpers'

interface ICollapsibleList
  extends Omit<CollapseProps, 'className' | 'in'>,
    Omit<React.ComponentPropsWithoutRef<'div'>, keyof CollapseProps> {
  children: React.ReactNode
  className?: (({ isOpen }: { isOpen: boolean }) => string) | string
  classNames?: {
    container?: string
    trigger?: string
  }
  defaultExpanded?: boolean
  title: string
}

export function CollapsibleList({
  children,
  className,
  defaultExpanded = false,
  title,
  classNames,
  ...collapseProps
}: ICollapsibleList) {
  const [isOpen, { toggle, close, open }] = useDisclosure(defaultExpanded)

  React.useEffect(() => {
    if (defaultExpanded) {
      open()
    } else {
      close()
    }
  }, [close, defaultExpanded, open])

  const _className =
    typeof className === 'function' ? className({ isOpen }) : className

  return (
    <div className={cn('flex flex-col gap-2', _className)}>
      <div
        className={cn(
          'flex items-center justify-between',
          classNames?.container,
        )}
      >
        <button
          className={cn(
            'flex flex-1 flex-row items-center gap-2 pl-2 text-sm',
            classNames?.trigger,
          )}
          onClick={() => toggle()}
        >
          {title}
        </button>

        <div className="inline-flex gap-2">
          <ActionIconButton onClick={() => toggle()}>
            {isOpen ? <ChevronsUp size={16} /> : <ChevronsDown size={16} />}
          </ActionIconButton>
        </div>
      </div>

      <Collapse in={isOpen} {...collapseProps}>
        {children}
      </Collapse>
    </div>
  )
}
