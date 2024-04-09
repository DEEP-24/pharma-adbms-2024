import { Page } from '~/components/page'
import { Section } from '~/components/section'

type DashboardErrorLayoutProps = {
  children: React.ReactNode
  header?: React.ReactNode
}

export function DashboardErrorLayout({
  children,
  header,
}: DashboardErrorLayoutProps) {
  return (
    <Page.Layout>
      {header}

      <Page.Main>
        <Section>{children}</Section>
      </Page.Main>
    </Page.Layout>
  )
}
