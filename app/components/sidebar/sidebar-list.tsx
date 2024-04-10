import { SidebarSection } from '~/components/sidebar/sidebar-section'

import { SidebarItem, type SidebarItemProps } from './sidebar-item'

export type SidebarListProps = {
  items: SidebarItemProps[]
  title?: string
}

export const SidebarList = ({ section }: { section: SidebarListProps[] }) => {
  return (
    <div className="flex flex-col gap-6">
      {section.map(({ items, title }, idx) => (
        <SidebarSection key={idx} title={title}>
          <div className="flex flex-col gap-2">
            {items.map(item => (
              <SidebarItem key={item.name} {...item} />
            ))}
          </div>
        </SidebarSection>
      ))}
    </div>
  )
}
