import {
  Card,
  Divider,
  PasswordInput,
  Select,
  TextInput,
  Textarea,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, json, redirect, useActionData } from '@remix-run/react'
import { CalendarIcon, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { UserRole } from '~/enums'
import { getDoctorByEmail } from '~/lib/doctor.server'
import { getPatientByEmail } from '~/lib/patient.server'
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
import {
  DoctorQualification,
  DoctorSpecialization,
  Gender,
} from '~/utils/prisma-enums'
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
  const { fieldErrors, fields } = await validateAction(
    request,
    createUserSchema,
  )

  if (fieldErrors) {
    return badRequest<ActionData>({ fieldErrors })
  }

  const {
    email,
    password,
    firstName,
    lastName,
    gender,
    dob,
    phone,
    role,
    age,
    height,
    weight,
    specialization,
    qualification,
    address,
  } = fields

  let user

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
      firstName,
      lastName,
      password,
      gender,
      dob,
      phone,
      age,
      specialization,
      qualification,
      address,
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
      firstName,
      lastName,
      address,
      age,
      height,
      weight,
      password,
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
  const [gender, setGender] = React.useState<Gender>(Gender.MALE)
  const [specialization, setSpecialization] =
    React.useState<DoctorSpecialization>(DoctorSpecialization.CARDIOLOGIST)
  const [qualification, setQualification] = React.useState<DoctorQualification>(
    DoctorQualification.MD,
  )

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="mb-10">
        <p className="text-4xl font-semibold text-black">
          Pharmaceutical Inventory
        </p>
      </div>

      <Card
        className="w-[600px] bg-gray-100"
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
          <Form className="mt-4 flex flex-col gap-8" method="post">
            <fieldset className="grid grid-cols-2 gap-4" disabled={isPending}>
              <Select
                name="role"
                className="col-span-2"
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
                error={actionData?.fieldErrors?.firstName}
                label="First Name"
                name="firstName"
                required
                withAsterisk={false}
              />
              <TextInput
                error={actionData?.fieldErrors?.lastName}
                label="Last Name"
                name="lastName"
                required
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
                error={actionData?.fieldErrors?.phone}
                type="number"
                label="Phone number"
                name="phone"
                required
                withAsterisk={false}
              />

              <TextInput
                autoComplete="email"
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
              {role === UserRole.PATIENT && (
                <>
                  <TextInput
                    error={actionData?.fieldErrors?.height}
                    label="Height (cm)"
                    name="height"
                    type="number"
                    required
                    withAsterisk={false}
                  />
                  <TextInput
                    error={actionData?.fieldErrors?.weight}
                    label="Weight (pounds)"
                    name="weight"
                    type="number"
                    required
                    withAsterisk={false}
                  />
                </>
              )}

              {role === UserRole.DOCTOR && (
                <>
                  <Select
                    error={actionData?.fieldErrors?.specialization}
                    label="Specialization"
                    name="specialization"
                    value={specialization}
                    onChange={e => setSpecialization(e as DoctorSpecialization)}
                    data={Object.values(DoctorSpecialization).map(
                      specialization => ({
                        label: specialization,
                        value: specialization,
                      }),
                    )}
                    required
                    withAsterisk={false}
                  />
                  <Select
                    error={actionData?.fieldErrors?.qualification}
                    label="Qualification"
                    name="qualification"
                    value={qualification}
                    onChange={e => setQualification(e as DoctorQualification)}
                    data={Object.values(DoctorQualification).map(
                      qualification => ({
                        label: qualification,
                        value: qualification,
                      }),
                    )}
                    required
                    withAsterisk={false}
                  />
                </>
              )}

              <TextInput
                error={actionData?.fieldErrors?.age}
                label="Age"
                name="age"
                type="number"
                required
                withAsterisk={false}
              />

              <Textarea
                error={actionData?.fieldErrors?.address}
                label="Address"
                name="address"
                required
                withAsterisk={false}
              />
            </fieldset>

            <div className="col-span-2">
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
            </div>
          </Form>
        </Card.Section>
      </Card>
    </div>
  )
}
