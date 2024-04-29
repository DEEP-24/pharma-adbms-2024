import { ActionIcon, Badge, NativeSelect } from '@mantine/core'
import { OrderStatus } from '@prisma/client'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useSubmit } from '@remix-run/react'
import {
  CheckCircleIcon,
  MinusCircleIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from 'lucide-react'
import * as React from 'react'
import invariant from 'tiny-invariant'
import { Page } from '~/components/page'
import { Section } from '~/components/section'
import { db } from '~/lib/db.server'
import { getOrders } from '~/lib/order.server'
import { titleCase } from '~/utils/misc'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const orders = await getOrders()

  return json({ orders })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()

  const intent = formData.get('intent')?.toString()
  invariant(intent, 'Invalid intent')

  const orderId = formData.get('orderId')?.toString()
  invariant(orderId, 'Invalid order id')

  const customerEmail = formData.get('customerEmail')?.toString()
  invariant(customerEmail, 'Invalid customer email')

  switch (intent) {
    case 'approve-order': {
      await db.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.ACCEPTED },
      })

      return json({ success: true })
    }

    case 'reject-order': {
      await db.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.REJECTED },
      })

      return json({ success: true })
    }
    case 'update-order-status': {
      const status = formData.get('status')?.toString()
      invariant(status, 'Invalid status')

      await db.order.update({
        where: { id: orderId },
        data: { status: status as OrderStatus },
      })

      return json({ success: true })
    }

    default:
      return json(
        { success: false, message: 'Invalid intent' },
        { status: 400 },
      )
  }
}

export default function Orders() {
  const { orders } = useLoaderData<typeof loader>()
  const [isPending, startTransition] = React.useTransition()
  const submit = useSubmit()

  return (
    <Page.Layout>
      <Page.Header icon={<ShoppingBagIcon size={14} />} title="Orders" />
      <Page.Main>
        <Section className="overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the orders in your account including their user
                  details.
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    {orders.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Name
                            </th>

                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                            >
                              Update status
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-[rgb(129, 135, 80)] divide-y divide-gray-200">
                          {orders.map(order => {
                            const isOrderPending =
                              order.status === OrderStatus.PENDING
                            const isOrderCancelled =
                              order.status === OrderStatus.CANCELLED
                            const isOrderRejected =
                              order.status === OrderStatus.REJECTED
                            const isOrderCompleted =
                              order.status === OrderStatus.COMPLETED

                            const statusOptions = [
                              'ACCEPTED',
                              'REJECTED',
                              'COMPLETED',
                              'CANCELLED',
                            ]

                            return (
                              <tr key={order.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                  <div className="flex items-center">
                                    <div className="ml-4">
                                      <div className="font-medium text-gray-900">
                                        {order.patient.name}
                                      </div>
                                      <div className="text-gray-500">
                                        {order.patient.email}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  <Badge
                                    color={
                                      isOrderPending
                                        ? 'gray'
                                        : isOrderCancelled
                                          ? 'indigo'
                                          : isOrderRejected
                                            ? 'red'
                                            : 'green'
                                    }
                                  >
                                    {titleCase(order.status)}
                                  </Badge>
                                </td>
                                <td className="relative flex items-center justify-center whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-6">
                                  <div className="flex items-center gap-2">
                                    {isOrderPending ? (
                                      <>
                                        <ActionIcon
                                          color="green"
                                          disabled={
                                            isPending || !isOrderPending
                                          }
                                          onClick={() =>
                                            submit(
                                              {
                                                intent: 'approve-order',
                                                orderId: order.id,
                                                customerEmail:
                                                  order.patient.email,
                                              },
                                              {
                                                method: 'post',
                                                replace: true,
                                              },
                                            )
                                          }
                                        >
                                          <CheckCircleIcon className="h-6" />
                                        </ActionIcon>
                                        <ActionIcon
                                          color="red"
                                          type="submit"
                                          name="intent"
                                          value="reject-order"
                                          disabled={
                                            isPending || !isOrderPending
                                          }
                                          onClick={() => {
                                            submit(
                                              {
                                                intent: 'reject-order',
                                                orderId: order.id,
                                                customerEmail:
                                                  order.patient.email,
                                              },
                                              {
                                                method: 'post',
                                                replace: true,
                                              },
                                            )
                                          }}
                                        >
                                          <MinusCircleIcon className="h-7" />
                                        </ActionIcon>
                                      </>
                                    ) : !isOrderRejected &&
                                      !isOrderCompleted ? (
                                      <>
                                        <NativeSelect
                                          className="w-48"
                                          defaultValue={order.status}
                                          disabled={
                                            isPending || isOrderCompleted
                                          }
                                          data={statusOptions}
                                          onChange={e => {
                                            submit(
                                              {
                                                intent: 'update-order-status',
                                                orderId: order.id,
                                                status: e.target.value,
                                                customerEmail:
                                                  order.patient.email,
                                              },
                                              {
                                                method: 'post',
                                                replace: true,
                                              },
                                            )
                                          }}
                                        />
                                      </>
                                    ) : null}
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="bg-[rgb(129, 135, 80)] relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                        <ShoppingCartIcon className="mx-auto h-9 w-9 text-gray-500" />
                        <span className="mt-4 block text-sm font-medium text-gray-500">
                          No orders placed yet. <br />
                          Come back later.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </Page.Main>
    </Page.Layout>
  )
}
