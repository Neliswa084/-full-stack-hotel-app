import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { getConfig } from '../../utils/getConfig'

export interface PaymentState {
    loading: boolean;
    error: string | null;
}

const initialState: PaymentState = {
    loading: false,
    error: null,
}

export const initializePayment = createAsyncThunk(
    'payment/initializePayment',
    async (bookingId: number, thunkAPI) => {
        try {
            const response = await axios.post(
                '/api/payments/initialize',
                { booking_id: bookingId },
                getConfig()
            )
            return response.data // { authorization_url, reference }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to start payment')
        }
    }
)

export const verifyPayment = createAsyncThunk(
    'payment/verifyPayment',
    async (reference: string, thunkAPI) => {
        try {
            const response = await axios.get(`/api/payments/verify/${reference}`, getConfig())
            return response.data // { message, booking }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to verify payment')
        }
    }
)

export const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initializePayment.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(initializePayment.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(initializePayment.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(verifyPayment.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(verifyPayment.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export default paymentSlice.reducer