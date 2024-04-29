import * as React from 'react'
import { toast } from 'sonner'
import { useLocalStorageState } from '~/utils/hooks/use-local-storage-state'

const LocalStorageKey = 'pharma-cart'

export type CartItem = {
  id: string
  name: string
  brand: string
  dosage: number
  unit: string
  price: number
  quantity: number
  stock: number
}

interface ICartContext {
  itemsInCart: Array<CartItem>
  addItemToCart: (item: CartItem) => void
  removeItemFromCart: (itemId: CartItem['id']) => void
  clearCart: (showToast?: boolean) => void
  updateQuantity: (itemId: CartItem['id'], quantity: number) => void
  totalPrice: number
}

const CartContext = React.createContext<ICartContext | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorageState<CartItem[]>({
    key: LocalStorageKey,
    defaultValue: [],
  })

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )

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
      const existingItemIndex = items.findIndex(i => i.id === item.id)

      if (existingItemIndex === -1) {
        setItems(prev => [...prev, item])
        toast.success('Item added to cart')
      } else {
        const updatedItems = [...items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        }
        setItems(updatedItems)
        toast.info('Item quantity updated in cart')
      }
    },
    [items, setItems],
  )

  const removeItemFromCart = (itemId: CartItem['id']) => {
    setItems(prev => prev.filter(item => item.id !== itemId))
    toast.success('Item removed from cart')
  }

  const updateQuantity = React.useCallback(
    (itemId: CartItem['id'], quantity: number) => {
      setItems(prev => {
        const newItems = [...prev]

        const index = newItems.findIndex(i => i.id === itemId)
        if (index > -1) {
          newItems[index].quantity = quantity
        }

        return newItems
      })
    },
    [setItems],
  )

  return (
    <CartContext.Provider
      value={{
        itemsInCart: items,
        totalPrice,
        addItemToCart,
        removeItemFromCart,
        updateQuantity,
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
