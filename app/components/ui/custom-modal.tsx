import * as React from 'react'

import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Maximize2Icon, Minimize2Icon, XIcon } from 'lucide-react'

import { ActionIconButton } from '~/components/ui/action-icon-button'
import { cn } from '~/utils/helpers'

type FooterSectionProps =
  | (({ close }: { close: () => void }) => React.ReactNode)
  | React.ReactNode

interface CustomModalProps {
  afterClose?: () => void
  afterOpen?: () => void
  children: React.ReactNode
  closeOnClickOutside?: false
  closeOnEscape?: false
  description?: React.ReactNode
  footerSection?: FooterSectionProps
  onClose: () => void
  open: boolean
  overlayProps?: React.ComponentPropsWithoutRef<typeof Modal.Overlay>
  title: string
  withFullScreenToggle?: boolean
}

export function CustomModal(props: CustomModalProps) {
  const {
    afterClose,
    afterOpen,
    children,
    closeOnClickOutside = false,
    closeOnEscape = false,
    description,
    footerSection,
    onClose,
    open,
    overlayProps,
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

  const showTitleInHeader = !description

  return (
    <>
      <Modal.Root
        centered
        closeOnClickOutside={closeOnClickOutside}
        closeOnEscape={closeOnEscape}
        fullScreen={isFullScreen}
        onClose={() => handleClose()}
        opened={open}
        size="lg"
        styles={{
          content: {
            display: 'flex',
            flexDirection: 'column',
            // Matching the bottom border of the header with that of the `SectionHeader` component
            marginTop: -3,
            overflowY: 'hidden',
          },
        }}
        transitionProps={{
          onEnter: () => afterOpen?.(),
          onExit: () => afterClose?.(),
          transition: 'slide-down',
        }}
      >
        <Modal.Overlay opacity={0.4} {...overlayProps} />
        <Modal.Content className="rounded-sm">
          <Modal.Header className="flex min-h-14 flex-col items-start border-b border-b-stone-200/70 bg-stone-50 p-0">
            <div
              className={cn(
                'flex h-full w-full items-center  p-3 px-4',
                showTitleInHeader ? 'justify-between' : 'justify-end',
              )}
            >
              {showTitleInHeader ? (
                <Modal.Title className="pl-4 text-base font-medium text-gray-500 ">
                  {title}
                </Modal.Title>
              ) : null}

              <div className="flex items-center gap-2">
                <ActionIconButton
                  className={cn({
                    hidden: !withFullScreenToggle,
                  })}
                  onClick={() => toggleFullScreen.toggle()}
                  size="lg"
                  tooltipLabel={isFullScreen ? 'Minimize' : 'Maximize'}
                >
                  {isFullScreen ? (
                    <Minimize2Icon size={16} />
                  ) : (
                    <Maximize2Icon size={16} />
                  )}
                </ActionIconButton>

                <ActionIconButton
                  onClick={() => onClose()}
                  size="lg"
                  tooltipLabel="Close"
                >
                  <XIcon size={16} />
                </ActionIconButton>
              </div>
            </div>
          </Modal.Header>

          <Modal.Body className="custom-scrollbar relative flex-1 overflow-y-auto p-0">
            <div className="flex h-full flex-col">
              {showTitleInHeader ? null : (
                <div className="sticky top-0 flex flex-col gap-2 border-b border-b-stone-200/70 bg-stone-50 px-8 py-6">
                  <Modal.Title className="text-lg font-bold text-gray-500 ">
                    {title}
                  </Modal.Title>
                  {description ? (
                    <p className="text-sm text-gray-400">{description}</p>
                  ) : null}
                </div>
              )}

              <div className="flex-1 overflow-y-auto px-8 py-6">{children}</div>
            </div>

            {footerSection ? (
              <div className="sticky bottom-0 min-h-12 border-t border-stone-200 bg-white px-6 py-3">
                {renderFooterSection()}
              </div>
            ) : (
              <div className="sticky bottom-0 min-h-12 py-3" />
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  )
}
