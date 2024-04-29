import { Badge } from '@mantine/core'
import { OrderStatus } from '@prisma/client'
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  SerializeFrom,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { CheckCircleIcon, ShoppingBagIcon } from 'lucide-react'
import * as React from 'react'
import { Page } from '~/components/page'
import { Section } from '~/components/section'
import { useCart } from '~/context/CartContext'
import { getOrdersByPatientId } from '~/lib/order.server'
import { requireUserId } from '~/lib/session.server'
import { statusLabelLookup } from '~/utils/helpers'
import { badRequest, unauthorized } from '~/utils/misc.server'

const dateFormatter = new Intl.DateTimeFormat('en-US')

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request)
  const orders = await getOrdersByPatientId(userId)

  return json({ orders })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()

  const intent = formData.get('intent')?.toString()
  if (!userId || !intent) {
    return unauthorized({ success: false, message: 'Unauthorized' })
  }

  switch (intent) {
    case 'cancel-order': {
      const orderId = formData.get('orderId')?.toString()
      if (!orderId) {
        return badRequest({ success: false, message: 'Invalid order id' })
      }

      //   return cancelOrder(orderId)
      //     .then(() => {
      //       json({ success: true })
      //     })
      //     .catch(e =>
      //       json({ success: false, message: e.message }, { status: 500 }),
      //     )
    }

    default:
      return badRequest({ success: false, message: 'Invalid intent' })
  }
}
export default function OrderHistory() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { orders } = useLoaderData<typeof loader>()

  const { clearCart } = useCart()

  React.useEffect(() => {
    const isSuccess = searchParams.get('success')

    if (isSuccess && isSuccess === 'true') {
      clearCart()
      setSearchParams({})
    }
  }, [clearCart, searchParams, setSearchParams])

  return (
    <Page.Layout>
      <Page.Header icon={<ShoppingBagIcon size={14} />} title="Order History" />
      <Page.Main>
        <Section>
          <div className="mt-16">
            <div className="mx-auto sm:px-2 lg:px-8">
              <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-7xl lg:px-0">
                {orders.length > 0 ? (
                  <>
                    {orders.map(order => (
                      <Order order={order} key={order.id} />
                    ))}
                  </>
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>
          </div>
        </Section>
      </Page.Main>
    </Page.Layout>
  )
}

function EmptyState() {
  return (
    <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
      <ShoppingBagIcon className="mx-auto h-9 w-9 text-gray-500" />
      <span className="mt-4 block text-sm font-medium text-gray-500">
        No previous orders
      </span>
    </div>
  )
}

function Order({
  order,
}: {
  order: SerializeFrom<typeof loader>['orders'][number]
}) {
  const isOrderPending = order.status === OrderStatus.PENDING
  const isOrderCancelled = order.status === OrderStatus.CANCELLED

  const isOrderFulfilled = order.status === OrderStatus.COMPLETED

  return (
    <>
      <div className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
        <h3 className="sr-only">
          Order placed on{' '}
          <time dateTime={order.createdAt}>
            {dateFormatter.format(new Date(order.createdAt))}
          </time>
        </h3>

        <div className="flex items-center justify-between px-4 py-6 sm:gap-6 sm:px-6 lg:gap-8">
          <dl className="flex items-center gap-8">
            <div>
              <dt className="font-medium text-gray-900">Order number</dt>
              <dd className="mt-1 text-gray-500">
                {order.id.slice(-6).toUpperCase()}
              </dd>
            </div>

            <div className="hidden sm:block">
              <dt className="font-medium text-gray-900">Date placed</dt>
              <dd className="mt-1 text-gray-500">
                <time dateTime={order.createdAt}>
                  {dateFormatter.format(new Date(order.createdAt))}
                </time>
              </dd>
            </div>

            <div>
              <dt className="font-medium text-gray-900">Total amount</dt>
              <dd className="mt-1 font-medium text-gray-900">
                ${order?.totalAmount.toFixed(2)}
              </dd>
            </div>

            <div className="flex justify-between pt-6 text-gray-900 sm:block sm:pt-0">
              <dt className="font-medium text-gray-900">Status</dt>
              <dd className="mt-1 font-medium text-gray-900">
                <Badge
                  color={
                    isOrderPending
                      ? 'blue'
                      : isOrderCancelled
                        ? 'indigo'
                        : 'green'
                  }
                >
                  {statusLabelLookup(order.status)}
                </Badge>
              </dd>
            </div>
          </dl>
        </div>

        {/* Items */}
        <ul className="divide-y divide-gray-200">
          {order.medications.map(({ medication, quantity }) => (
            <li key={medication.id} className="p-4 sm:p-6">
              <div className="flex items-center sm:items-start">
                <div className="flex-1 text-sm">
                  <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                    <h5>
                      {medication.name} <i>(x{quantity})</i>
                    </h5>
                    <p className="mt-2 sm:mt-0">
                      ${(medication.price * quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:flex sm:justify-between">
                <div className="flex items-center">
                  {isOrderFulfilled ? (
                    <>
                      <CheckCircleIcon
                        className="h-5 w-5 text-green-500"
                        aria-hidden="true"
                      />

                      <p className="ml-2 text-sm font-medium text-gray-500">
                        Completed on{' '}
                        <time dateTime={order.createdAt}>
                          {dateFormatter.format(new Date(order.createdAt))}
                        </time>
                      </p>
                    </>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
