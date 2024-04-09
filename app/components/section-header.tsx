import { cn } from '~/utils/helpers'

type SectionHeaderProps = {
  children?: React.ReactNode
  className?: string
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
  withBottomBorder?: boolean
  withTopBorder?: boolean
}

export function SectionHeader({
  children,
  className,
  leftSlot,
  rightSlot,
  withBottomBorder = true,
  withTopBorder = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex h-9 items-center justify-between px-3',
        withBottomBorder ? 'border-b border-b-stone-200' : '',
        withTopBorder ? 'border-t border-t-stone-200' : '',
        className,
      )}
    >
      <div className="flex w-full items-center justify-between gap-4">
        {children ?? (
          <>
            <div className="flex-1">{leftSlot} </div>
            <div>{rightSlot}</div>
          </>
        )}
      </div>
    </div>
  )
}
