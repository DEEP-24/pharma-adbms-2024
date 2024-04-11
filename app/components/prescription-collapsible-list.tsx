import { Badge, ScrollArea } from '@mantine/core'
import { Prescription } from '@prisma/client'
import { NavLink } from '@remix-run/react'
import { ArrowUpRightIcon } from 'lucide-react'

import { CollapsibleList } from '~/components/collapsible-list'
import { ActionIconButton } from '~/components/ui/action-icon-button'
import { cn } from '~/utils/helpers'
import { formatDate } from '~/utils/misc'

type PrescriptionListProps = {
  prescriptions: Prescription[]
  defaultExpanded?: boolean
  emptyState?: string
  renderItem?: ({
    prescription,
  }: {
    prescription: Prescription
  }) => React.ReactNode
  title?: string
}

const DefaultEmptyStateRenderer = ({ message }: { message: string }) => (
  <div className="flex flex-col gap-3 rounded border p-3">
    <div className="flex h-full items-center justify-center">
      <span className="text-sm">{message}</span>
    </div>
  </div>
)

export const PrescriptionList = ({
  prescriptions,
  defaultExpanded = false,
  emptyState = 'No prescriptions found',
  renderItem = PrescriptionListItem,
  title = 'Prescriptions',
}: PrescriptionListProps) => {
  const renderContent = () => {
    if (prescriptions.length > 0) {
      return (
        <ScrollArea
          classNames={{
            root: 'max-h-64 overflow-y-auto rounded border',
          }}
          offsetScrollbars
          scrollbarSize={8}
          type="hover"
        >
          {prescriptions.map(prescription => renderItem({ prescription }))}
        </ScrollArea>
      )
    }

    return <DefaultEmptyStateRenderer message={emptyState} />
  }

  return (
    <CollapsibleList
      className={({ isOpen }) =>
        cn('rounded border px-1.5 pt-2', isOpen ? 'pb-1.5' : 'pb-2')
      }
      defaultExpanded={defaultExpanded}
      title={title}
    >
      {renderContent()}
    </CollapsibleList>
  )
}

type PrescriptionListItemProps = {
  prescription: Prescription
}

export const PrescriptionListItem = ({
  prescription,
}: PrescriptionListItemProps) => {
  return (
    <NavLink
      className={cn(
        'group flex items-center justify-between border-b border-b-slate-200 px-3 py-2 last:border-none',
      )}
      key={prescription.id}
      prefetch="intent"
      to={prescription.id}
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-2">
            <div>
              <p className="text-xsm">
                {formatDate(prescription.createdAt, { timeStyle: 'short' })}
              </p>
            </div>
          </div>

          {isActive ? (
            <Badge
              className="ml-2"
              color="indigo"
              radius="sm"
              size="xs"
              variant="light"
            >
              Current
            </Badge>
          ) : (
            <ActionIconButton color="gray">
              <ArrowUpRightIcon size={18} />
            </ActionIconButton>
          )}
        </>
      )}
    </NavLink>
  )
}
