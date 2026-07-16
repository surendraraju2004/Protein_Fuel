import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const cartFromStorage = localStorage.getItem('nutribite_cart')
  ? JSON.parse(localStorage.getItem('nutribite_cart'))
  : []

const saveToStorage = (items) => {
  localStorage.setItem('nutribite_cart', JSON.stringify(items))
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: cartFromStorage,
    coupon: null,
    discountAmount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1, flavor = '' } = action.payload
      const existing = state.items.find(
        (i) => i.product === product._id && i.flavor === flavor
      )
      if (existing) {
        existing.quantity += quantity
      } else {
        state.items.push({
          product: product._id,
          name: product.name,
          image: product.images?.[0] || '',
          price: product.discountPrice > 0 ? product.discountPrice : product.price,
          quantity,
          flavor,
          slug: product.slug,
        })
      }
      saveToStorage(state.items)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.product !== action.payload)
      saveToStorage(state.items)
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload
      const item = state.items.find((i) => i.product === productId)
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.product !== productId)
        } else {
          item.quantity = quantity
        }
      }
      saveToStorage(state.items)
    },
    clearCart: (state) => {
      state.items = []
      state.coupon = null
      state.discountAmount = 0
      localStorage.removeItem('nutribite_cart')
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload
      state.discountAmount = action.payload.discountAmount
    },
    removeCoupon: (state) => {
      state.coupon = null
      state.discountAmount = 0
    },
    setCartFromServer: (state, action) => {
      state.items = action.payload
      saveToStorage(state.items)
    },
  },
})

export const {
  addToCart, removeFromCart, updateQuantity, clearCart,
  applyCoupon, removeCoupon, setCartFromServer,
} = cartSlice.actions

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
export const selectDiscount = (state) => state.cart.discountAmount
export const selectCoupon = (state) => state.cart.coupon

export default cartSlice.reducer
