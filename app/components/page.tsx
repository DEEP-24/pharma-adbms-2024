import * as React from 'react'

import { Link } from '@remix-run/react'
import { ArrowLeftIcon, SidebarOpenIcon } from 'lucide-react'

import { ActionIconButton } from '~/components/ui/action-icon-button'
import { Separator } from '~/components/ui/separator'
import { DashboardView, cn } from '~/utils/helpers'
import { useSidebarStore } from '~/utils/store/sidebar-store'

const PageContext = React.createContext<{ hasHeader: boolean }>({
  hasHeader: false,
})

function Layout({ children }: { children: React.ReactNode }) {
  let hasHeader = false

  React.Children.forEach(children, child => {
    if (React.isValidElement(child) && child.type === Header) {
      hasHeader = true
    }
  })

  return (
    <PageContext.Provider value={{ hasHeader }}>
      <div className="flex w-full flex-col">{children}</div>
    </PageContext.Provider>
  )
}

type PageHeaderProps = {
  action?: React.ReactNode
  backButtonHref?: string
} & (
  | {
      children: React.ReactNode
      icon?: never
      title?: never
    }
  | {
      children?: never
      icon?: React.ReactNode
      title: string
    }
)

function BackButton({ href }: { href: string }) {
  return (
    <ActionIconButton component={Link} to={href}>
      <ArrowLeftIcon className="text-neutral-200" size={16} />
    </ActionIconButton>
  )
}

function Header(props: PageHeaderProps): React.ReactElement {
  const { action, backButtonHref } = props

  const toggleSidebar = useSidebarStore(state => state.toggle)
  const isSidebarOpen = useSidebarStore(state => state.isOpen)

  return (
    <div className="z-20 flex min-h-header items-center justify-between pl-0 pr-3">
      <div className="flex w-full items-center gap-1.5">
        <div
          className={cn(
            'ml-1 inline-flex items-center gap-1',
            isSidebarOpen ? 'hidden' : '',
          )}
        >
          <ActionIconButton
            className=""
            color="dark"
            onClick={() => toggleSidebar()}
            tooltipLabel="Expand sidebar"
          >
            <SidebarOpenIcon size={14} className="text-neutral-200" />
          </ActionIconButton>

          <Separator className="h-3 bg-gray-300" orientation="vertical" />
        </div>

        <div
          className={cn(
            'flex flex-1 flex-row items-center gap-1',
            isSidebarOpen ? 'pl-2' : 'pl-1.5',
            backButtonHref ? 'pl-0' : '',
          )}
        >
          {backButtonHref ? <BackButton href={backButtonHref} /> : null}

          {props.children ?? (
            <div className=" flex w-full items-center gap-2 text-neutral-200">
              {props.icon}
              <span className="flex max-w-[50%] truncate text-sm">
                {props.title}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="inline-flex gap-2">{action}</div>
    </div>
  )
}

type PageBodyProps = {
  children: React.ReactNode
  className?: string
  noHeader?: boolean
  variant?: DashboardView
}

const variantParentMap = {
  expanded: 'pb-0 pr-0',
  standard: 'pb-3 pr-3',
} satisfies Record<NonNullable<PageBodyProps['variant']>, string>

const variantPanelMap = {
  expanded: 'rounded-tl-md border-l border-t border-stone-200',
  standard: 'rounded-md border border-stone-200 bg-white shadow-sm',
} satisfies Record<NonNullable<PageBodyProps['variant']>, string>

function MainContent({
  children,
  className,
  variant = DashboardView.standard,
}: PageBodyProps) {
  const { hasHeader } = React.useContext(PageContext)

  return (
    <div
      className={cn(
        'flex min-h-0 w-full flex-1 flex-row rounded-sm',
        hasHeader ? 'mt-0' : 'mt-3',
        variantParentMap[variant],
        className,
      )}
    >
      <div className="relative flex w-full flex-col">
        <div
          className={cn(
            'h-full w-full overflow-auto bg-white',
            variantPanelMap[variant],
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export const Page = {
  Header,
  Layout,
  Main: MainContent,
}
