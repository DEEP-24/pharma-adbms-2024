import { OrderStatus, Patient } from '@prisma/client'
import { CartItem } from '~/context/CartContext'
import { db } from '~/lib/db.server'
import { PaymentMethod } from '~/utils/prisma-enums'

export async function getOrdersByPatientId(userId: Patient['id']) {
  return db.order.findMany({
    where: {
      patientId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      medications: {
        include: {
          medication: true,
        },
      },
      payment: true,
    },
  })
}

export async function getOrders() {
  return db.order.findMany({
    include: {
      medications: {
        include: {
          medication: true,
        },
      },
      patient: true,
      payment: true,
    },
  })
}

export async function createOrder({
  patientId,
  products,
  amount,
  paymentMethod,
}: {
  patientId: Patient['id']
  products: Array<CartItem>
  amount: number
  paymentMethod: string
}) {
  return db.order.create({
    data: {
      patientId,
      totalAmount: amount,
      status: OrderStatus.PENDING,
      medications: {
        createMany: {
          data: products.map(product => ({
            medicationId: product.id,
            quantity: product.quantity,
            brand: product.brand,
            dosage: product.dosage.toString(),
            price: product.price,
          })),
        },
      },
      payment: {
        create: {
          paymentMethod: paymentMethod as PaymentMethod,
          amount,
        },
      },
    },
  })
}
