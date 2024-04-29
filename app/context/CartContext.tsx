import * as React from 'react'
import { toast } from 'sonner'
import { useLocalStorageState } from '~/utils/hooks/use-local-storage-state'

const LocalStorageKey = 'pharmaCart'

export type PrescribedMedicationType = {
  medicationName: string
  medicationBrand: string
  dosage: string
  duration: string
  frequency: string
  timing: string
  remarks?: string | null
}

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  prescribedMedications: PrescribedMedicationType[]
}

interface ICartContext {
  itemsInCart: Array<CartItem>
  addItemToCart: (item: CartItem) => void
  removeItemFromCart: (itemId: CartItem['id']) => void
  clearCart: (showToast?: boolean) => void
  totalPrice: number
}

const CartContext = React.createContext<ICartContext | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorageState<CartItem[]>({
    key: LocalStorageKey,
    defaultValue: [],
  })

  const totalPrice = items.reduce((acc, item) => acc + item.price, 0)

  const clearCart = React.useCallback(
    (showToast: boolean = true) => {
      setItems([])

      if (showToast) {
        toast.success('Cart cleared')
      }
    },
    [setItems],
  )

  const addItemToCart = React.useCallback(
    (item: CartItem) => {
      const isAlreadyInCart = items.some(i => i.id === item.id)

      if (!isAlreadyInCart) {
        setItems(prev => [...prev, item])

        toast.success('Item added to cart')
      } else {
        toast.error('Item already in cart')
      }
    },
    [items, setItems],
  )

  const removeItemFromCart = (itemId: CartItem['id']) => {
    setItems(prev => prev.filter(item => item.id !== itemId))

    toast.success('Item removed from cart')
  }

  return (
    <CartContext.Provider
      value={{
        itemsInCart: items,
        totalPrice,
        addItemToCart,
        removeItemFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = React.useContext(CartContext)
  if (!context) {
    throw new Error('`useCart()` must be used within a <CartProvider />')
  }

  return context
}
