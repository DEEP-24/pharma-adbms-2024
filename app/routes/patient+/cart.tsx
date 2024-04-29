import {
  ActionIcon,
  Button,
  Input,
  Modal,
  NumberInput,
  Select,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { PaymentMethod } from '@prisma/client'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { Link, useFetcher, useLocation, useNavigate } from '@remix-run/react'
import { MinusCircleIcon, ShoppingCartIcon, TrashIcon } from 'lucide-react'
import * as React from 'react'
import ReactInputMask from 'react-input-mask'
import { $path } from 'remix-routes'
import { jsonWithSuccess, redirectWithSuccess } from 'remix-toast'
import { Page } from '~/components/page'
import { Section } from '~/components/section'
import { CustomButton } from '~/components/ui/custom-button'
import type { CartItem } from '~/context/CartContext'
import { useCart } from '~/context/CartContext'
import { createOrder } from '~/lib/order.server'
import { requireUserId } from '~/lib/session.server'
import { useUser } from '~/utils/hooks/use-auth'
import { titleCase } from '~/utils/misc'
import { badRequest } from '~/utils/misc.server'

type ActionData = Partial<{
  success: boolean
  message: string
}>

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()

  const userId = await requireUserId(request)
  const intent = formData.get('intent')?.toString()

  if (!intent) {
    return json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  switch (intent) {
    case 'place-order': {
      const stringifiedProducts = formData.get('products[]')?.toString()
      const amount = formData.get('amount')?.toString()
      const paymentMethod = formData.get('paymentMethod')?.toString()

      if (!stringifiedProducts || !amount || !paymentMethod) {
        return badRequest<ActionData>({
          success: false,
          message: 'Invalid request body',
        })
      }

      const products = JSON.parse(stringifiedProducts) as Array<CartItem>

      await createOrder({
        patientId: userId,
        products,
        amount: Number(amount),
        paymentMethod: paymentMethod as PaymentMethod,
      })

      return redirectWithSuccess(
        $path('/patient/order-history'),
        'Order placed successfully',
      )
    }
  }
}

export default function Cart() {
  const id = React.useId()
  const navigate = useNavigate()
  const location = useLocation()
  const fetcher = useFetcher<ActionData>()

  const { clearCart, itemsInCart, totalPrice } = useCart()
  const user = useUser()

  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>(
    PaymentMethod.CREDIT_CARD,
  )
  const [pickupDate, setPickupDate] = React.useState<Date | null>(
    new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
  )
  const [pickupTime, setPickupTime] = React.useState<Date | null>(
    new Date(new Date().setHours(16, 0, 0, 0)),
  )

  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false)
  const [cardNumber, setCardNumber] = React.useState<string>('1234567891234567')
  const [cardExpiry, setCardExpiry] = React.useState<Date | null>(
    new Date('2026-12-31'),
  )
  const [cardCvv, setCardCvv] = React.useState<string>('123')
  const [errors, setErrors] = React.useState<{
    cardNumber?: string
    cardExpiry?: string
    cardCvv?: string
  }>({
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  })

  const closePaymentModal = () => setIsPaymentModalOpen(false)
  const showPaymentModal = () => setIsPaymentModalOpen(true)

  const placeOrder = () => {
    setErrors({
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
    })

    if (cardNumber.replace(/[_ ]/g, '').length !== 16) {
      setErrors(prevError => ({
        ...prevError,
        cardNumber: 'Card number must be 16 digits',
      }))
    }

    if (!cardExpiry) {
      setErrors(prevError => ({
        ...prevError,
        cardExpiry: 'Card expiry is required',
      }))
    }

    if (!cardCvv || cardCvv.length !== 3) {
      setErrors(prevError => ({
        ...prevError,
        cardCvv: 'Card CVV must be 3 digits',
      }))
    }

    if (Object.values(errors).some(error => error !== '')) {
      return
    }

    const pickupDateTime =
      pickupDate && pickupTime
        ? new Date(
            pickupDate.setHours(
              pickupTime.getHours(),
              pickupTime.getMinutes(),
              0,
              0,
            ),
          )
        : null
    fetcher.submit(
      {
        'products[]': JSON.stringify(itemsInCart),
        amount: totalPrice.toString(),
        intent: 'place-order',
        paymentMethod,
        pickupDate: pickupDate?.toISOString() ?? '',
        pickupTime: pickupDateTime?.toISOString() ?? '',
      },
      {
        method: 'post',
      },
    )
  }

  const isSubmitting = fetcher.state !== 'idle'

  React.useEffect(() => {
    if (isSubmitting || !fetcher.data) {
      return
    }

    if (!fetcher.data.success) {
      showNotification({
        title: 'Error',
        message: fetcher.data.message,
        icon: <MinusCircleIcon className="h-7 w-7" />,
        color: 'red',
      })
      return
    }

    clearCart(false)

    showNotification({
      title: 'Success',
      message: fetcher.data.message,
      color: 'green',
    })

    navigate('/order-history')
  }, [clearCart, fetcher.data, isSubmitting, navigate])

  return (
    <>
      <Page.Layout>
        <Page.Header icon={<ShoppingCartIcon size={14} />} title="Cart" />
        <Page.Main>
          <Section className="overflow-auto">
            <div className="flex flex-col gap-4 p-2">
              <div className="bg-white">
                <div className="px-4 py-16">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                        Your cart
                      </h1>
                      <p className="mt-2 text-sm text-gray-500">
                        Products in your cart
                      </p>
                    </div>

                    {itemsInCart.length > 0 ? (
                      <div className="space-x-2">
                        <Button
                          variant="subtle"
                          color="red"
                          onClick={() => clearCart()}
                          disabled={isSubmitting}
                        >
                          Clear cart
                        </Button>

                        {user ? (
                          <Button
                            variant="light"
                            loading={isSubmitting}
                            onClick={() => showPaymentModal()}
                          >
                            Make payment
                          </Button>
                        ) : (
                          <Button
                            variant="light"
                            component={Link}
                            to={`/login?redirectTo=${encodeURIComponent(
                              location.pathname,
                            )}`}
                          >
                            Sign in to order
                          </Button>
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-16">
                    <h2 className="sr-only">Current ice-creams in cart</h2>

                    <div className="flex flex-col gap-12">
                      {itemsInCart.length > 0 ? <CartItems /> : <EmptyState />}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Modal
              opened={!!user && isPaymentModalOpen}
              onClose={closePaymentModal}
              title="Payment"
              centered
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-sm text-gray-600">
                    <span className="font-semibold">Amount: </span>
                    <span>${totalPrice}</span>
                  </h2>
                </div>

                <Select
                  label="Payment method"
                  value={paymentMethod}
                  clearable={false}
                  onChange={e => setPaymentMethod(e as PaymentMethod)}
                  data={Object.values(PaymentMethod).map(method => ({
                    label: titleCase(method.replace(/_/g, ' ')),
                    value: method,
                  }))}
                />

                <Input.Wrapper
                  id={id}
                  label="Credit card number"
                  required
                  error={errors.cardNumber}
                >
                  <Input
                    id={id}
                    component={ReactInputMask}
                    mask="9999 9999 9999 9999"
                    placeholder="XXXX XXXX XXXX XXXX"
                    alwaysShowMask={false}
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                  />
                </Input.Wrapper>

                <div className="flex items-center gap-4">
                  <Input.Wrapper
                    id={id + 'cvv'}
                    label="CVV"
                    required
                    error={errors.cardCvv}
                  >
                    <Input
                      id={id + 'cvv'}
                      name="cvv"
                      component={ReactInputMask}
                      mask="999"
                      placeholder="XXX"
                      alwaysShowMask={false}
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                    />
                  </Input.Wrapper>

                  <DatePickerInput
                    valueFormat="MM/YYYY"
                    clearable={false}
                    placeholder="MM/YYYY"
                    name="expiry-date"
                    label="Expiry"
                    required
                    value={cardExpiry}
                    minDate={new Date()}
                    onChange={e => setCardExpiry(e)}
                    error={errors.cardExpiry}
                    hideOutsideDates
                  />
                </div>

                <div className="mt-6 flex items-center gap-4 sm:justify-end">
                  <Button
                    variant="subtle"
                    color="red"
                    onClick={() => closePaymentModal()}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="filled"
                    onClick={() => placeOrder()}
                    loading={isSubmitting}
                  >
                    Place order
                  </Button>
                </div>
              </div>
            </Modal>
          </Section>
        </Page.Main>
      </Page.Layout>
    </>
  )
}

function CartItems() {
  const { itemsInCart, totalPrice } = useCart()

  return (
    <>
      <table className="mt-4 w-full text-gray-500 sm:mt-6">
        <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
          <tr>
            <th scope="col" className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3">
              Product Name
            </th>
            <th scope="col" className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3">
              Brand
            </th>
            <th
              scope="col"
              className="hidden py-3 pr-8 font-normal sm:table-cell"
            >
              Quantity
            </th>
            <th
              scope="col"
              className="hidden py-3 pr-8 font-normal sm:table-cell"
            >
              Price
            </th>
            <th scope="col" className="w-0 py-3 text-right font-normal" />
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
          {itemsInCart.map(item => (
            <ItemRow item={item} key={item.id} />
          ))}

          <tr>
            <td className="py-6 pr-8">
              <div className="flex items-center">
                <div>
                  <div className="font-medium text-gray-900" />
                  <div className="mt-1 sm:hidden" />
                </div>
              </div>
            </td>
            <td className="py-6 pr-8">
              <div className="flex items-center">
                <div>
                  <div className="font-medium text-gray-900" />
                  <div className="mt-1 sm:hidden" />
                </div>
              </div>
            </td>

            <td className="hidden py-6 pr-8 sm:table-cell" />
            <td className="hidden py-6 pr-8 font-semibold sm:table-cell">
              <span>${totalPrice.toFixed(2)}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

function ItemRow({ item }: { item: CartItem }) {
  const { removeItemFromCart, updateQuantity } = useCart()

  const itemTotalPrice = item.price * item.quantity

  const [quantity, setQuantity] = React.useState<number | ''>(
    item.quantity ?? '',
  )

  React.useEffect(() => {
    if (quantity !== '') {
      updateQuantity(item.id, Number(quantity))
    }
  }, [item.id, quantity, updateQuantity])

  return (
    <tr key={item.id}>
      <td className="py-6 pl-4 pr-8">
        {item.name} ({item.dosage}-{item.unit})
      </td>
      <td className="py-6 pr-8">{item.brand}</td>
      <td className="py-6 pr-8">
        <NumberInput
          min={1}
          value={quantity}
          onChange={val => setQuantity(Number(val))}
          className="w-20"
        />
      </td>
      <td className="py-6 pr-8 font-semibold">${itemTotalPrice.toFixed(2)}</td>
      <td className="py-6 pr-8 text-right">
        <CustomButton onClick={() => removeItemFromCart(item.id)}>
          <TrashIcon className="h-3 w-3" />
        </CustomButton>
      </td>
    </tr>
  )
}

function EmptyState() {
  return (
    <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
      <ShoppingCartIcon className="mx-auto h-9 w-9 text-gray-500" />
      <span className="mt-4 block text-sm font-medium text-gray-500">
        Your cart is empty
      </span>
    </div>
  )
}
