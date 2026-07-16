import { createSlice } from '@reduxjs/toolkit'

const userFromStorage = localStorage.getItem('nutribite_user')
  ? JSON.parse(localStorage.getItem('nutribite_user'))
  : null

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage,
    isAuthenticated: !!userFromStorage,
    loading: false,
    error: null,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.user = action.payload
      state.isAuthenticated = true
      localStorage.setItem('nutribite_user', JSON.stringify(action.payload))
    },
    loginFail: (state, action) => {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      localStorage.removeItem('nutribite_user')
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('nutribite_user', JSON.stringify(state.user))
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { loginStart, loginSuccess, loginFail, logout, updateUser, clearError } = authSlice.actions
export default authSlice.reducer
