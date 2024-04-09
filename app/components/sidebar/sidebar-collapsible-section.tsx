import { Disclosure } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '~/utils/helpers'
import { useSidebarStore } from '~/utils/store/sidebar-store'

export const SidebarCollapsibleSection = ({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) => {
  const isSidebarOpen = useSidebarStore(state => state.isOpen)

  return (
    <Disclosure
      as="div"
      className="space-y-2 overflow-hidden"
      defaultOpen={true}
    >
      {({ open }) => (
        <>
          <Disclosure.Button
            className={cn(
              'flex items-center gap-1',
              isSidebarOpen
                ? 'w-auto opacity-100'
                : 'pointer-events-none w-0 opacity-0',
            )}
          >
            {title ? (
              <>
                <ChevronDownIcon
                  className={cn(
                    'text-stone-400',
                    open ? 'rotate-180 transform' : '',
                  )}
                  size={14}
                />
                <p
                  className={cn(
                    'text-[11px] font-semibold uppercase text-gray-400',
                  )}
                >
                  {title}
                </p>
              </>
            ) : null}
          </Disclosure.Button>

          <AnimatePresence initial={false} mode="sync">
            {open ? (
              <Disclosure.Panel
                animate={open ? 'open' : 'closed'}
                as={motion.div}
                exit="closed"
                initial="closed"
                static
                transition={{
                  duration: 0.1,
                  type: 'tween',
                }}
                variants={{
                  closed: {
                    height: 0,
                  },
                  open: {
                    height: 'auto',
                  },
                }}
              >
                {children}
              </Disclosure.Panel>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  )
}
