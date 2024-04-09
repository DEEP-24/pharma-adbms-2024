import { Drawer, type MantineSize } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  ArrowLeftFromLineIcon,
  ArrowRightFromLineIcon,
  XIcon,
} from 'lucide-react'

import { ActionIconButton } from '~/components/ui/action-icon-button'
import { cn } from '~/utils/helpers'

type FooterSectionProps =
  | (({ close }: { close: () => void }) => React.ReactNode)
  | React.ReactNode

interface CustomDrawerProps {
  afterClose?: () => void
  afterOpen?: () => void
  children: React.ReactNode
  description?: string
  footerSection?: FooterSectionProps
  onClose: () => void
  open: boolean
  overlayProps?: React.ComponentPropsWithoutRef<typeof Drawer.Overlay>
  size?: MantineSize | number | (string & {})
  title: string
  withFullScreenToggle?: boolean
}

export function CustomDrawer(props: CustomDrawerProps) {
  const {
    afterClose,
    afterOpen,
    children,
    description,
    footerSection,
    onClose,
    open,
    overlayProps,
    size,
    title,
    withFullScreenToggle = false,
  } = props

  const [isFullScreen, toggleFullScreen] = useDisclosure()

  const handleClose = () => {
    onClose()
    toggleFullScreen.close()
  }

  const renderFooterSection = () => {
    if (typeof footerSection === 'function') {
      return footerSection({ close: handleClose })
    }

    return footerSection
  }

  return (
    <>
      <Drawer.Root
        onClose={() => handleClose()}
        opened={open}
        position="right"
        size={isFullScreen ? '100%' : size || 'auto'}
        styles={{
          content: {
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'hidden',
          },
        }}
        transitionProps={{
          onEnter: () => afterOpen?.(),
          onExit: () => afterClose?.(),
        }}
      >
        <Drawer.Overlay opacity={0.4} {...overlayProps} />
        <Drawer.Content>
          <Drawer.Header className="flex h-14 min-h-14 flex-col items-start bg-stone-50 p-0">
            <div className="flex w-full items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <ActionIconButton
                  className={cn({
                    hidden: !withFullScreenToggle,
                  })}
                  onClick={() => toggleFullScreen.toggle()}
                  size="lg"
                  tooltipLabel="Expand"
                >
                  {isFullScreen ? (
                    <ArrowRightFromLineIcon size={14} />
                  ) : (
                    <ArrowLeftFromLineIcon size={14} />
                  )}
                </ActionIconButton>
              </div>

              <ActionIconButton
                autoFocus
                onClick={() => handleClose()}
                size="lg"
                tooltipLabel="Close"
              >
                <XIcon size={16} />
              </ActionIconButton>
            </div>
          </Drawer.Header>

          <div className="my-0 h-px w-full bg-stone-200/70" />

          <Drawer.Body className="flex-1 overflow-y-auto p-0">
            <div className="flex h-full flex-col">
              <div className="flex flex-col gap-2 border-b border-b-stone-200/70 bg-stone-50 px-8 py-6">
                <Drawer.Title className="text-lg font-bold text-gray-500 ">
                  {title}
                </Drawer.Title>
                <p className="text-sm text-gray-400">{description}</p>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-6">{children}</div>

              {footerSection ? (
                <div className="sticky bottom-0 min-h-12 border-t border-stone-200 bg-white px-8 py-3">
                  {renderFooterSection()}
                </div>
              ) : (
                <div className="sticky bottom-0 min-h-12 py-3" />
              )}
            </div>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  )
}
