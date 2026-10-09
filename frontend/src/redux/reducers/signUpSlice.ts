import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export interface RegisterData {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  password: string
}

export interface SignUpState extends RegisterData {
  loading: boolean
  error: string | null
}

const initialState: SignUpState = {
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  password: '',
  loading: false,
  error: null
}

export const registerUserThunk = createAsyncThunk(
  'signUp/registerUser',
  async (userData: RegisterData, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/register', userData)
      return response.data
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Server error')
    }
  }
)

export const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    setFirstName: (state, action: PayloadAction<string>) => {
      state.first_name = action.payload
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.last_name = action.payload
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phone_number = action.payload
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUserThunk.fulfilled, () => {
        return initialState          
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { setFirstName, setLastName, setEmail, setPhoneNumber, setPassword } = signUpSlice.actions
export default signUpSlice.reducer