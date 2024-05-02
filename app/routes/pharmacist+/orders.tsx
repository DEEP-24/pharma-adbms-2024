import { ActionIcon, Badge, NativeSelect } from '@mantine/core'
import { OrderStatus } from '@prisma/client'
import type { ActionFunctionArgs } from '@remix-run/node'
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
import { updateMedicationStock } from '~/lib/medication.server'
import { titleCase } from '~/utils/misc'

const dateFormatter = new Intl.DateTimeFormat('en-US')

export const loader = async () => {
  const orders = await db.order.findMany({
    include: {
      medications: {
        include: {
          medication: true,
        },
      },
      patient: true,
      payment: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  console.log(orders[0].medications)

  return json({ orders })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()

  const intent = formData.get('intent')?.toString()
  invariant(intent, 'Invalid intent')

  const orderId = formData.get('orderId')?.toString()
  invariant(orderId, 'Invalid order id')
  const status = formData.get('status')?.toString()
  invariant(status, 'Invalid status')

  switch (intent) {
    case 'update-order-status': {
      const updatedOrder = await db.order.update({
        where: { id: orderId },
        data: {
          status: status as OrderStatus,
        },
        include: {
          medications: true,
        },
      })

      if (status === OrderStatus.COMPLETED) {
        const updatePromises = updatedOrder.medications.map(medication =>
          updateMedicationStock({
            medicationId: medication.medicationId,
            quantitySold: medication.quantity,
          }),
        )
        await Promise.all(updatePromises)
      }

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
                            const isOrderInProgress =
                              order.status === OrderStatus.IN_PROGRESS
                            const isOrderOutOfStock =
                              order.status === OrderStatus.OUT_OF_STOCK
                            const isOrderCompleted =
                              order.status === OrderStatus.COMPLETED

                            const statusOptions: Array<OrderStatus> = [
                              'IN_PROGRESS',
                              'COMPLETED',
                              'OUT_OF_STOCK',
                            ]

                            return (
                              <>
                                <tr key={order.id}>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                    <div className="flex items-center">
                                      <div className="ml-4">
                                        <div className="font-medium text-gray-900">
                                          {order.patient.firstName}{' '}
                                          {order.patient.lastName}
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
                                        isOrderInProgress
                                          ? 'gray'
                                          : isOrderCompleted
                                            ? 'indigo'
                                            : isOrderOutOfStock
                                              ? 'red'
                                              : 'green'
                                      }
                                    >
                                      {titleCase(order.status)}
                                    </Badge>
                                  </td>
                                  <td className="relative flex items-center justify-center whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-6">
                                    <div className="flex items-center gap-2">
                                      {!isOrderCompleted ? (
                                        <>
                                          <NativeSelect
                                            className="w-48"
                                            defaultValue={order.status}
                                            disabled={
                                              isPending || isOrderCompleted
                                            }
                                            data={
                                              isOrderCompleted
                                                ? []
                                                : statusOptions
                                            }
                                            onChange={e => {
                                              submit(
                                                {
                                                  intent: 'update-order-status',
                                                  orderId: order.id,
                                                  status: e.target.value,
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
                                <tr>
                                  <td>
                                    <ul className="divide-y divide-gray-200">
                                      {order.medications.map(
                                        orderMedications => (
                                          <li
                                            key={orderMedications.medication.id}
                                            className="p-4 sm:p-6"
                                          >
                                            <div className="flex items-center sm:items-start">
                                              <div className="flex-1 text-sm">
                                                <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                                                  <h5>
                                                    {
                                                      orderMedications
                                                        .medication.name
                                                    }{' '}
                                                    <i>
                                                      (x
                                                      {
                                                        orderMedications.quantity
                                                      }
                                                      )
                                                    </i>
                                                  </h5>
                                                  <p className="mt-2 sm:mt-0">
                                                    $
                                                    {(
                                                      orderMedications
                                                        .medication.price *
                                                      orderMedications
                                                        .medication.quantity
                                                    ).toFixed(2)}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="mt-6 sm:flex sm:justify-between">
                                              <div className="flex items-center">
                                                {isOrderCompleted ? (
                                                  <>
                                                    <CheckCircleIcon
                                                      className="h-5 w-5 text-green-500"
                                                      aria-hidden="true"
                                                    />
                                                    <p className="ml-2 text-sm font-medium text-gray-500">
                                                      Completed on{' '}
                                                      <time
                                                        dateTime={
                                                          order.createdAt
                                                        }
                                                      >
                                                        {dateFormatter.format(
                                                          new Date(
                                                            order.createdAt,
                                                          ),
                                                        )}
                                                      </time>
                                                    </p>
                                                  </>
                                                ) : null}
                                              </div>
                                            </div>
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </td>
                                </tr>
                              </>
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
