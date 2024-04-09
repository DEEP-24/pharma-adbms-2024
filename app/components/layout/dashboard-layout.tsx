export default function DashboardLayout({
  bottomSlot,
  main,
  nav,
  topSlot,
}: {
  bottomSlot?: React.ReactNode
  main: React.ReactNode
  nav?: React.ReactNode
  topSlot?: React.ReactNode
}) {
  return (
    <div className="relative flex h-screen w-full flex-col bg-stone-100">
      {topSlot ? topSlot : null}

      <div className="flex min-h-0 flex-auto flex-row">
        {nav ? nav : null}

        <div className="flex flex-1 overflow-hidden">{main}</div>
      </div>

      {bottomSlot ? bottomSlot : null}
    </div>
  )
}
