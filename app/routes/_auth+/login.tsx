import { Card, Divider, PasswordInput, Select, TextInput } from '@mantine/core'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, redirect, useActionData } from '@remix-run/react'
import { ChevronRight } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { verifyAdminLogin } from '~/lib/admin.server'
import { verifyDoctorLogin } from '~/lib/doctor.server'
import { verifyPatientLogin } from '~/lib/patient.server'
import { verifyPharmacistLogin } from '~/lib/pharmacist.server'
import {
  createUserSession,
  getUserId,
  getUserRole,
  isAdmin,
  isDoctor,
  isPatient,
  isPharmacist,
} from '~/lib/session.server'
import { UserRole } from '~/enums'
import { useIsPending } from '~/utils/hooks/use-is-pending'
import { badRequest, safeRedirect } from '~/utils/misc.server'
import { type inferErrors, validateAction } from '~/utils/validation'
import { loginSchema } from '~/utils/zod.schema'

interface ActionData {
  fieldErrors?: inferErrors<typeof loginSchema>
}

export type SearchParams = {
  redirectTo?: string
}

const userRoleRedirect = {
  [UserRole.ADMIN]: '/admin',
  [UserRole.DOCTOR]: '/doctor',
  [UserRole.PATIENT]: '/patient',
  [UserRole.PHARMACIST]: '/pharmacist',
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request)
  const userRole = await getUserRole(request)

  if (!userId || !userRole) {
    return null
  }

  if (await isAdmin(request)) {
    return redirect('/admin')
  }

  if (await isPharmacist(request)) {
    return redirect('/pharmacist')
  }

  if (await isDoctor(request)) {
    return redirect('/doctor')
  }

  if (await isPatient(request)) {
    return redirect('/patient')
  }

  return null
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { fieldErrors, fields } = await validateAction(request, loginSchema)

  if (fieldErrors) {
    return badRequest<ActionData>({ fieldErrors })
  }

  const { email, password, redirectTo, remember, role } = fields
  let user
  if (role === UserRole.ADMIN) {
    user = await verifyAdminLogin({ email, password })
  } else if (role === UserRole.DOCTOR) {
    user = await verifyDoctorLogin({ email, password })
  } else if (role === UserRole.PATIENT) {
    user = await verifyPatientLogin({ email, password })
  } else if (role === UserRole.PHARMACIST) {
    user = await verifyPharmacistLogin({ email, password })
  }

  if (!user) {
    return badRequest<ActionData>({
      fieldErrors: {
        email: 'Invalid email',
        password: 'Invalid password',
      },
    })
  }

  return createUserSession({
    redirectTo: safeRedirect(redirectTo || userRoleRedirect[role]),
    remember: remember === 'on' ? true : false,
    request,
    role: role,
    userId: user.id,
  })
}

export default function Login() {
  const actionData = useActionData<ActionData>()
  const isPending = useIsPending()

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="mb-10 flex items-center justify-center">
        <p className="text-4xl font-semibold text-black">
          Pharmaceutical Inventory
        </p>
      </div>

      <Card
        className="w-96 bg-gray-100"
        padding="xl"
        radius="lg"
        shadow="xl"
        withBorder
      >
        <Card.Section className="bg-white" inheritPadding pb="sm" pt="xl">
          <h2 className="text-center text-xl font-bold text-gray-900">
            Welcome
          </h2>
          <p className="text-center text-sm text-gray-600">
            Please sign in to your account.
          </p>
        </Card.Section>

        <Card.Section
          className="bg-white"
          inheritPadding
          pt="md"
          withBorder={false}
        >
          <Divider />
        </Card.Section>

        <Card.Section
          className="rounded-b-xl bg-white"
          inheritPadding
          pb="xl"
          withBorder
        >
          <Form className="mt-8" method="post">
            <fieldset className="flex flex-col gap-6" disabled={isPending}>
              <Select
                name="role"
                label="Role"
                data={Object.values(UserRole).map(role => ({
                  value: role,
                  label: role,
                }))}
              />
              <TextInput
                autoComplete="email"
                autoFocus
                error={actionData?.fieldErrors?.email}
                label="Email address"
                name="email"
                required
                type="email"
                withAsterisk={false}
              />

              <PasswordInput
                autoComplete="current-password"
                error={actionData?.fieldErrors?.password}
                label="Password"
                name="password"
                required
                withAsterisk={false}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-sm" htmlFor="rememberMe">
                    Remember me
                  </Label>
                  <Switch id="rememberMe" name="rememberMe" />
                </div>
                <div>
                  <Link to="/register" className="text-sm hover:underline">
                    Don't have an account?
                  </Link>
                </div>
              </div>

              <Button className="mt-2" loading={isPending} type="submit">
                Continue <ChevronRight className="ml-2" size={14} />
              </Button>
            </fieldset>
          </Form>
        </Card.Section>

        {/* <Card.Section className="" inheritPadding py="sm">
          <div className="flex items-center justify-center gap-2">
            <p className="text-xsm font-medium text-gray-400">Secured by</p>
            <img alt="TR" className="h-5 w-auto" src="/images/logo-new.png" />
          </div>
        </Card.Section> */}
      </Card>
    </div>
  )
}
