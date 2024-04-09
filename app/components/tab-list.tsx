import * as React from 'react'

import { NavLink } from '@remix-run/react'
import { motion } from 'framer-motion'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { cn } from '~/utils/helpers'

interface TabLinkItemProps {
  disabled?: boolean
  href: string
  icon: React.ReactNode
  name: string
}

const TabContext = React.createContext<
  | {
      id?: string
    }
  | undefined
>(undefined)

const useTabListContext = () => {
  const context = React.useContext(TabContext)

  if (!context) {
    throw new Error('`useTabContext()` must be used within a `<TabList>`')
  }

  return context
}

interface TabListProps {
  children?:
    | ((item: TabLinkItemProps) => React.ReactNode)
    | React.ReactNode
    | React.ReactNode[]
  id?: string
  items: TabLinkItemProps[]
  renderItem?: (item: TabLinkItemProps) => React.ReactNode
}

export function TabList({
  children,
  id,
  items,
  renderItem = defaultRenderFunction,
}: TabListProps) {
  const customId = React.useId()

  const renderContent = () => {
    if (!children) {
      return items.map(renderItem)
    }

    if (typeof children === 'function') {
      return items.map(children)
    }

    return children
  }

  return (
    <TabContext.Provider value={{ id: id || customId }}>
      <div className="flex h-full items-center gap-3">{renderContent()}</div>
    </TabContext.Provider>
  )
}

const defaultRenderFunction = (item: TabLinkItemProps) => {
  return <TabLinkItem key={item.name} {...item} />
}

export function TabLinkItem({
  href,
  icon,
  name,
  disabled = false,
}: TabLinkItemProps) {
  const { id } = useTabListContext()

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger
          asChild={!disabled}
          className={cn(disabled ? 'cursor-not-allowed' : '')}
        >
          <NavLink
            className={cn(
              'relative flex h-full items-center gap-2',
              disabled ? 'pointer-events-none cursor-not-allowed' : '',
            )}
            end
            prefetch="intent"
            to={href}
          >
            {({ isActive }) => (
              <>
                <div className="select-none py-1">
                  <div
                    className={cn(
                      'flex items-center gap-1.5 rounded px-2 py-1 text-sm',
                      disabled ? 'text-gray-400' : 'hover:bg-gray-100',
                    )}
                  >
                    {icon}
                    <span className="">{name}</span>
                  </div>
                </div>

                {isActive ? (
                  <motion.div
                    className="absolute inset-x-0 bottom-[-1px] w-full"
                    layoutId={`tab-link-${id}`}
                    transition={{
                      duration: 0.15,
                    }}
                  >
                    <div className="h-0.5 bg-black" />
                  </motion.div>
                ) : null}
              </>
            )}
          </NavLink>
        </TooltipTrigger>
        {disabled ? (
          <TooltipContent side="top">
            <p>Not available for this appointment type</p>
          </TooltipContent>
        ) : null}
      </Tooltip>
    </TooltipProvider>
  )
}
