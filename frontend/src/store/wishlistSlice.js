import { createSlice } from '@reduxjs/toolkit'

const wishlistFromStorage = localStorage.getItem('nutribite_wishlist')
  ? JSON.parse(localStorage.getItem('nutribite_wishlist'))
  : []

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: wishlistFromStorage,
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload
      const index = state.items.findIndex((p) => p._id === product._id)
      if (index > -1) {
        state.items.splice(index, 1)
      } else {
        state.items.push(product)
      }
      localStorage.setItem('nutribite_wishlist', JSON.stringify(state.items))
    },
    clearWishlist: (state) => {
      state.items = []
      localStorage.removeItem('nutribite_wishlist')
    },
    setWishlist: (state, action) => {
      state.items = action.payload
      localStorage.setItem('nutribite_wishlist', JSON.stringify(state.items))
    },
  },
})

export const { toggleWishlist, clearWishlist, setWishlist } = wishlistSlice.actions
export const selectWishlist = (state) => state.wishlist.items
export const selectIsWishlisted = (productId) => (state) =>
  state.wishlist.items.some((p) => p._id === productId)
export default wishlistSlice.reducer
