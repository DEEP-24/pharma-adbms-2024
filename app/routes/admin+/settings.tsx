import { PasswordInput, TextInput } from '@mantine/core'
import { type ActionFunctionArgs } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { $path } from 'remix-routes'
import {
  jsonWithError,
  jsonWithSuccess,
  redirectWithSuccess,
} from 'remix-toast'

import { Page } from '~/components/page'
import { SettingsPageContainer } from '~/components/settings/SettingsPageContainer'
import { SettingsPageTitle } from '~/components/settings/SettingsPageTitle'
import { SettingsSection } from '~/components/settings/SettingsSection'
import { CustomButton } from '~/components/ui/custom-button'
import { UserRole } from '~/enums'
import { db } from '~/lib/db.server'
import { requireUserId } from '~/lib/session.server'
import { useUser } from '~/utils/hooks/use-auth'

const INTENT = {
  updateName: 'update-name',
  updatePassword: 'update-password',
} as const

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request)

  const formData = await request.formData()

  const intent = formData.get('intent')
  const role = formData.get('role')

  switch (intent) {
    case INTENT.updateName: {
      const name = formData.get('name')?.toString()

      if (!name) {
        return jsonWithError({ success: false }, 'Name is required')
      }

      if (role === UserRole.ADMIN) {
        await db.admin.update({
          where: {
            id: userId,
          },
          data: {
            name,
          },
        })

        return jsonWithSuccess({ success: true }, 'Name updated')
      }

      if (role === UserRole.DOCTOR) {
        await db.doctor.update({
          where: {
            id: userId,
          },
          data: {
            name,
          },
        })

        return jsonWithSuccess({ success: true }, 'Name updated')
      }

      if (role === UserRole.PATIENT) {
        await db.patient.update({
          where: {
            id: userId,
          },
          data: {
            name,
          },
        })

        return jsonWithSuccess({ success: true }, 'Name updated')
      }

      if (role === UserRole.PHARMACIST) {
        await db.pharmacist.update({
          where: {
            id: userId,
          },
          data: {
            name,
          },
        })

        return jsonWithSuccess({ success: true }, 'Name updated')
      }
    }

    case INTENT.updatePassword: {
      const password = formData.get('password')?.toString()
      if (!password) {
        return jsonWithError({ success: false }, 'Password is required')
      }

      if (role === UserRole.ADMIN) {
        await db.admin.update({
          where: {
            id: userId,
          },
          data: {
            password,
          },
        })

        return redirectWithSuccess(
          $path('/admin/settings'),
          'Password updated successfully!',
        )
      }

      if (role === UserRole.DOCTOR) {
        await db.doctor.update({
          where: {
            id: userId,
          },
          data: {
            password,
          },
        })

        return redirectWithSuccess(
          $path('/doctor/settings'),
          'Password updated successfully!',
        )
      }

      if (role === UserRole.PATIENT) {
        await db.patient.update({
          where: {
            id: userId,
          },
          data: {
            password,
          },
        })

        return redirectWithSuccess(
          $path('/patient/settings'),
          'Password updated successfully!',
        )
      }

      if (role === UserRole.PHARMACIST) {
        await db.pharmacist.update({
          where: {
            id: userId,
          },
          data: {
            password,
          },
        })

        return redirectWithSuccess(
          $path('/pharmacist/settings'),
          'Password updated successfully!',
        )
      }
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

          <UpdateNameForm />

          <SettingsSection
            description="You cannot change your email address"
            title="Email"
          >
            <TextInput defaultValue={user.email} disabled placeholder="Email" />
          </SettingsSection>
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
      description="The prefix displayed on your profile"
      title="Prefix"
    >
      <fetcher.Form className="flex flex-col gap-4" method="POST">
        <input name="role" type="hidden" value={user.role} />
        <TextInput
          autoFocus
          defaultValue={user.name}
          label="Name"
          name="name"
          placeholder="Enter name"
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

// function UpdatePasswordForm() {
//   const user = useUser()

//   const fetcher = useFetcher()
//   const isPending = fetcher.state !== 'idle'

//   return (
//     <SettingsSection title="Password">
//       <fetcher.Form className="flex flex-col gap-4" method="POST">
//         <input name="role" type="hidden" value={user.role} />
//         <PasswordInput
//           autoFocus
//           label="Enter a new password"
//           name="password"
//           placeholder="Leave blank to keep the same"
//           required
//           withAsterisk={false}
//         />

//         <div className="flex items-center gap-4">
//           <CustomButton
//             className="font-normal"
//             color="dark"
//             loading={isPending}
//             name="intent"
//             type="submit"
//             value={INTENT.updatePassword}
//             variant="filled"
//           >
//             Update
//           </CustomButton>
//         </div>
//       </fetcher.Form>
//     </SettingsSection>
//   )
// }
