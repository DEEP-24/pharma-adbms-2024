import {
  Card,
  Divider,
  NumberInput,
  PasswordInput,
  Select,
  TextInput,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, json, redirect, useActionData } from '@remix-run/react'
import { CalendarIcon, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { Gender, UserRole } from '~/enums'
import { getDoctorByEmail } from '~/lib/doctor.server'
import { getPatientByEmail } from '~/lib/patient.server'
import { getPharmacistByEmail } from '~/lib/pharmacist.server'
import {
  createUserSession,
  getUserId,
  getUserRole,
  isAdmin,
  isDoctor,
  isPatient,
  isPharmacist,
} from '~/lib/session.server'
import { createUser } from '~/lib/user.server'
import { useIsPending } from '~/utils/hooks/use-is-pending'
import { badRequest, safeRedirect } from '~/utils/misc.server'
import { validateAction, type inferErrors } from '~/utils/validation'
import { createUserSchema } from '~/utils/zod.schema'

interface ActionData {
  fieldErrors?: inferErrors<typeof createUserSchema>
}

export type SearchParams = {
  redirectTo?: string
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
  const searchParams = new URL(request.url).searchParams

  const { fieldErrors, fields } = await validateAction(
    request,
    createUserSchema,
  )

  if (fieldErrors) {
    return badRequest<ActionData>({ fieldErrors })
  }

  const { email, password, name, gender, dob, phone, confirmPassword, role } =
    fields

  let user
  if (role === UserRole.PHARMACIST) {
    const existingPharmacist = await getPharmacistByEmail(email)
    if (existingPharmacist) {
      return json({
        errors: {
          email: 'An user already exists with this email address.',
          password: null,
        },
      })
    }

    user = await createUser({
      email,
      name,
      password,
      confirmPassword,
      gender,
      dob,
      phone,
      role,
    })
  }

  if (role === UserRole.DOCTOR) {
    const existingDoctor = await getDoctorByEmail(email)
    if (existingDoctor) {
      return json({
        errors: {
          email: 'An user already exists with this email address.',
          password: null,
        },
      })
    }

    user = await createUser({
      email,
      name,
      password,
      confirmPassword,
      gender,
      dob,
      phone,
      role,
    })
  }

  if (role === UserRole.PATIENT) {
    const existingPatient = await getPatientByEmail(email)
    if (existingPatient) {
      return json({
        errors: {
          email: 'An user already exists with this email address.',
          password: null,
        },
      })
    }

    user = await createUser({
      email,
      name,
      password,
      confirmPassword,
      gender,
      dob,
      phone,
      role,
    })
  }

  if (!user) {
    return json({
      errors: {
        email: 'An unknown error occurred',
        password: 'An unknown error occurred',
      },
    })
  }

  return createUserSession({
    request,
    userId: user.id,
    role: role as UserRole,
    redirectTo: safeRedirect(`/${role?.toLowerCase()}`),
  })
}

export default function Register() {
  const actionData = useActionData<ActionData>()
  const isPending = useIsPending()

  const [role, setRole] = React.useState(UserRole.DOCTOR)
  const [gender, setGender] = React.useState(Gender.MALE)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="mb-10">
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
            Create an account.
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
                placeholder="Select your role"
                value={role}
                onChange={val => setRole(val as UserRole)}
                data={Object.values(UserRole)
                  .filter(
                    role =>
                      role !== UserRole.ADMIN && role !== UserRole.PHARMACIST,
                  )
                  .map(role => ({
                    label: role,
                    value: role,
                  }))}
                error={actionData?.fieldErrors?.role}
                required
                withAsterisk={false}
              />

              <TextInput
                autoFocus
                error={actionData?.fieldErrors?.name}
                label="Name"
                name="name"
                required
                type="text"
                withAsterisk={false}
              />

              <Select
                name="gender"
                label="Gender"
                placeholder="Select your gender"
                error={actionData?.fieldErrors?.gender}
                value={gender}
                onChange={val => setGender(val as Gender)}
                data={Object.values(Gender).map(gender => ({
                  label: gender,
                  value: gender,
                }))}
                required
                withAsterisk={false}
              />

              <DatePickerInput
                clearable
                defaultLevel="decade"
                dropdownType="popover"
                error={actionData?.fieldErrors?.dob}
                label="Date of birth"
                leftSection={
                  <CalendarIcon className="text-gray-400" size={14} />
                }
                leftSectionPointerEvents="none"
                maxDate={new Date()}
                name="dob"
                placeholder="Choose date of birth"
                popoverProps={{
                  withinPortal: true,
                }}
                required
                valueFormat="MM-DD-YYYY"
              />

              <TextInput
                autoFocus
                error={actionData?.fieldErrors?.phone}
                type="number"
                label="Phone number"
                name="phone"
                required
                withAsterisk={false}
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
                error={actionData?.fieldErrors?.password}
                label="Password"
                type="password"
                name="password"
                required
                withAsterisk={false}
              />

              <PasswordInput
                error={actionData?.fieldErrors?.confirmPassword}
                label="Confirm Password"
                type="password"
                name="confirmPassword"
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
                  <Link to="/login" className="text-sm hover:underline">
                    Have an account?
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
