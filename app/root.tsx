import '@mantine/charts/styles.css'
import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import { ModalsProvider as MantineModalsProvider } from '@mantine/modals'
import {
  json,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import * as React from 'react'
import { getToast } from 'remix-toast'
import { Toaster } from 'sonner'
import { FourOhFour } from '~/components/404'
import { GeneralErrorBoundary } from '~/components/GeneralErrorBoundary'
import { GlobalBlockerModal } from '~/components/global-blocker-modal'
import { UserRole } from '~/enums'
import { getAdmin } from '~/lib/admin.server'
import { getDoctor } from '~/lib/doctor.server'
import { getPatient } from '~/lib/patient.server'
import { getPharmacist } from '~/lib/pharmacist.server'
import { getUserId, getUserRole } from '~/lib/session.server'
import '~/styles/fonts.css'
import '~/styles/tailwind.css'
import { cn } from '~/utils/helpers'
import { useGlobalNavigationToast } from '~/utils/hooks/use-global-navigation-toast'
import EasyModal from '~/utils/modal-manager'
import { useNonce } from '~/utils/nonce-provider'

export type RootLoaderData = SerializeFrom<typeof loader>
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)
  const userRole = await getUserRole(request)
  const { headers: toastHeaders, toast } = await getToast(request)

  let response: {
    admin: Awaited<ReturnType<typeof getAdmin>>
    pharmacist: Awaited<ReturnType<typeof getPharmacist>>
    doctor: Awaited<ReturnType<typeof getDoctor>>
    patient: Awaited<ReturnType<typeof getPatient>>
  } = {
    admin: null,
    pharmacist: null,
    doctor: null,
    patient: null,
  }

  if (!userId || !userRole) {
    return response
  }

  if (userRole === UserRole.ADMIN) {
    response.admin = await getAdmin(request)
  } else if (userRole === UserRole.PHARMACIST) {
    response.pharmacist = await getPharmacist(request)
  } else if (userRole === UserRole.DOCTOR) {
    response.doctor = await getDoctor(request)
  } else if (userRole === UserRole.PATIENT) {
    response.patient = await getPatient(request)
  }

  return json(response)
}

function Document({
  children,
  nonce,
  title,
}: {
  children: React.ReactNode
  nonce: string
  title?: string
}) {
  return (
    <html className={cn('h-full')} lang="en">
      <head>
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body className="isolate h-full">
        <MantineProvider>
          {children}
          <ScrollRestoration />
          <Scripts />
        </MantineProvider>
      </body>
    </html>
  )
}

export default function App() {
  const nonce = useNonce()
  useGlobalNavigationToast()

  return (
    <Document nonce={nonce}>
      <Toaster
        closeButton
        duration={3000}
        position="top-right"
        richColors
        theme="light"
        visibleToasts={3}
      />
      <MantineModalsProvider>
        <GlobalBlockerModal />
        <EasyModal.Provider>
          <Outlet />
        </EasyModal.Provider>
      </MantineModalsProvider>
    </Document>
  )
}

export function ErrorBoundary() {
  const nonce = useNonce()

  return (
    <Document nonce={nonce}>
      <GeneralErrorBoundary
        className="max-w-full"
        statusHandlers={{
          404: () => <FourOhFour />,
        }}
      />
    </Document>
  )
}
