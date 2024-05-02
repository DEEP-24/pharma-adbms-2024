import { ActionFunctionArgs, json } from '@remix-run/node'

import { requireUserId } from '~/lib/session.server'
import { badRequest } from '~/utils/misc.server'

export type ActionData = Partial<{
  success: boolean
  message: string
}>

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()

  const patientId = await requireUserId(request)
  const intent = formData.get('intent')?.toString()

  if (!intent) {
    return json({ success: false, message: 'Unauthorized' })
  }

  switch (intent) {
    case 'make-payment': {
      const paymentMethod = formData.get('paymentMethod')?.toString()
      const orderId = formData.get('orderId')?.toString()

      if (!paymentMethod || !orderId) {
        return badRequest<ActionData>({
          success: false,
          message: 'Invalid request body',
        })
      }

      return json({
        success: true,
        message: 'Payment successful',
      })
    }
  }
}
