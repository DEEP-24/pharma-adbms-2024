import { TextInput, Textarea } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { type ActionFunctionArgs } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { jsonWithError, jsonWithSuccess } from 'remix-toast'

import { Page } from '~/components/page'
import { SettingsPageContainer } from '~/components/settings/SettingsPageContainer'
import { SettingsPageTitle } from '~/components/settings/SettingsPageTitle'
import { SettingsSection } from '~/components/settings/SettingsSection'
import { CustomButton } from '~/components/ui/custom-button'
import { db } from '~/lib/db.server'
import { requireUserId } from '~/lib/session.server'
import { useUser } from '~/utils/hooks/use-auth'

const INTENT = {
  updateName: 'update-name',
  updateDob: 'update-dob',
  updatePhoneNo: 'update-phone-no',
  updateAddress: 'update-address',
} as const

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request)

  const formData = await request.formData()

  const intent = formData.get('intent')

  switch (intent) {
    case INTENT.updateName: {
      const firstName = formData.get('firstName')?.toString()
      const lastName = formData.get('lastName')?.toString()

      if (!firstName || !lastName) {
        return jsonWithError({ success: false }, 'Name is required')
      }

      await db.patient.update({
        where: {
          id: userId,
        },
        data: {
          firstName,
          lastName,
        },
      })

      return jsonWithSuccess({ success: true }, 'Name updated')
    }

    case INTENT.updateAddress: {
      const address = formData.get('address')?.toString()

      if (!address) {
        return jsonWithError({ success: false }, 'Address is required')
      }

      await db.patient.update({
        where: {
          id: userId,
        },
        data: {
          address,
        },
      })

      return jsonWithSuccess({ success: true }, 'Address updated')
    }

    case INTENT.updatePhoneNo: {
      const phoneNo = formData.get('phoneNo')?.toString()

      if (!phoneNo) {
        return jsonWithError({ success: false }, 'Phone No is required')
      }

      await db.patient.update({
        where: {
          id: userId,
        },
        data: {
          phone: phoneNo,
        },
      })

      return jsonWithSuccess({ success: true }, 'Phone No updated')
    }

    case INTENT.updateDob: {
      const dob = formData.get('dob')?.toString()

      if (!dob) {
        return jsonWithError({ success: false }, 'DOB is required')
      }

      await db.patient.update({
        where: {
          id: userId,
        },
        data: {
          dob,
        },
      })

      return jsonWithSuccess({ success: true }, 'DOB updated')
    }

    default: {
      return jsonWithError({ success: false }, 'Invalid intent')
    }
  }
}

export default function AdminProfileSettings() {
  const user = useUser()

  return (
    <Page.Layout>
      <Page.Main>
        <SettingsPageContainer>
          <SettingsPageTitle title="Profile" />

          <div className="grid grid-cols-2 gap-x-4 gap-y-12">
            <UpdateNameForm />
            <UpdateDobForm />
            <UpdatePhoneNoForm />
            <UpdateAddressForm />
          </div>

          {/* <SettingsSection
            description="You cannot change your email address"
            title="Email"
          >
            <TextInput defaultValue={user.email} disabled placeholder="Email" />
          </SettingsSection> */}
        </SettingsPageContainer>
      </Page.Main>
    </Page.Layout>
  )
}

function UpdateNameForm() {
  const user = useUser()

  const fetcher = useFetcher()
  const isPending = fetcher.state !== 'idle'

  return (
    <SettingsSection
      title="Address"
      description="The prefix displayed on your profile"
    >
      <fetcher.Form className="flex flex-col gap-4" method="POST">
        <TextInput
          autoFocus
          defaultValue={user.firstName}
          label="First Name"
          name="firstName"
          placeholder="Enter first name"
          required
          withAsterisk={false}
        />

        <TextInput
          defaultValue={user.lastName}
          label="Last Name"
          name="lastName"
          placeholder="Enter last name"
          required
          withAsterisk={false}
        />

        <div className="flex items-center gap-4">
          <CustomButton
            className="font-normal"
            color="dark"
            loading={isPending}
            name="intent"
            type="submit"
            value={INTENT.updateName}
            variant="filled"
          >
            Update
          </CustomButton>
        </div>
      </fetcher.Form>
    </SettingsSection>
  )
}

function UpdateDobForm() {
  const user = useUser()

  const fetcher = useFetcher()
  const isPending = fetcher.state !== 'idle'

  return (
    <SettingsSection
      description="The DOB displayed on your profile"
      title="DOB"
    >
      <fetcher.Form className="flex flex-col gap-4" method="POST">
        <DatePickerInput
          autoFocus
          defaultValue={new Date(user.dob)}
          label="Date of birth"
          name="dob"
          placeholder="Choose date of birth"
          required
          withAsterisk={false}
        />

        <div className="flex items-center gap-4">
          <CustomButton
            className="font-normal"
            color="dark"
            loading={isPending}
            name="intent"
            type="submit"
            value={INTENT.updateDob}
            variant="filled"
          >
            Update
          </CustomButton>
        </div>
      </fetcher.Form>
    </SettingsSection>
  )
}

function UpdateAddressForm() {
  const user = useUser()

  const fetcher = useFetcher()
  const isPending = fetcher.state !== 'idle'

  return (
    <SettingsSection
      description="The prefix displayed on your profile"
      title="Prefix"
    >
      <fetcher.Form className="flex flex-col gap-4" method="POST">
        <Textarea
          autoFocus
          defaultValue={user.address}
          label="Address"
          name="address"
          placeholder="Enter address"
          required
          withAsterisk={false}
        />

        <div className="flex items-center gap-4">
          <CustomButton
            className="font-normal"
            color="dark"
            loading={isPending}
            name="intent"
            type="submit"
            value={INTENT.updateAddress}
            variant="filled"
          >
            Update
          </CustomButton>
        </div>
      </fetcher.Form>
    </SettingsSection>
  )
}

function UpdatePhoneNoForm() {
  const user = useUser()

  const fetcher = useFetcher()
  const isPending = fetcher.state !== 'idle'

  return (
    <SettingsSection
      description="The phone number displayed on your profile"
      title="Phone No"
    >
      <fetcher.Form className="flex flex-col gap-4" method="POST">
        <TextInput
          autoFocus
          defaultValue={user.phoneNo}
          label="Phone No"
          name="phoneNo"
          placeholder="Enter phone number"
          required
          withAsterisk={false}
        />

        <div className="flex items-center gap-4">
          <CustomButton
            className="font-normal"
            color="dark"
            loading={isPending}
            name="intent"
            type="submit"
            value={INTENT.updatePhoneNo}
            variant="filled"
          >
            Update
          </CustomButton>
        </div>
      </fetcher.Form>
    </SettingsSection>
  )
}
