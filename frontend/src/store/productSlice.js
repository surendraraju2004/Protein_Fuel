import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString()
      const { data } = await api.get(`/products?${query}`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load products')
    }
  }
)

export const fetchFeaturedProducts = createAsyncThunk(
  'products/featured',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products/featured')
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load featured')
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    featured: [],
    total: 0,
    pages: 0,
    page: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.items = []
      state.total = 0
      state.pages = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.products
        state.total = action.payload.total
        state.pages = action.payload.pages
        state.page = action.payload.page
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchFeaturedProducts.pending, (state) => { state.loading = true })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false
        state.featured = action.payload
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearProducts } = productSlice.actions
export default productSlice.reducer
