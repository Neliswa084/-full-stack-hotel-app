import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  phone_number: string | null
  role: 'guest' | 'admin'
}

export interface LoginData {
  email: string
  password: string
}

export interface LoginState {
  currentUser: User | null
  token: string | null
  loading: boolean
  error: string | null
}

const savedUser = localStorage.getItem('currentUser')
const savedToken = localStorage.getItem('token')

const initialState: LoginState = {
  currentUser: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken,
  loading: false,
  error: null,
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData: LoginData, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/login', loginData)
      return response.data          
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Server error')
    }
  }
)

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null
      state.token = null
      localStorage.removeItem('currentUser')
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('currentUser', JSON.stringify(action.payload.user))
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { logout } = loginSlice.actions
export default loginSlice.reducer