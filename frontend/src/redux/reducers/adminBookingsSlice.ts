import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { getConfig } from '../../utils/getConfig'
import type { Booking } from '../../types/booking'

export interface BookingsState {
    bookings: Booking[];
    loading: boolean;
    error: string | null;
}

const initialState: BookingsState = {
    bookings: [],
    loading: false,
    error: null,
}

export const fetchAllBookings = createAsyncThunk(
    'bookings/fetchAllBookings',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/api/bookings', getConfig())
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings')
        }
    }
)

export const updateBookingStatus = createAsyncThunk(
    'bookings/updateBookingStatus',
    async ({ id, status }: { id: number; status: string }, thunkAPI) => {
        try {
            const response = await axios.patch(`/api/bookings/${id}/status`, { status }, getConfig())
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update booking')
        }
    }
)

export const adminBookingsSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllBookings.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAllBookings.fulfilled, (state, action) => {
                state.loading = false
                state.bookings = action.payload
            })
            .addCase(fetchAllBookings.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(updateBookingStatus.pending, (state) => {
                state.error = null
            })
            .addCase(updateBookingStatus.rejected, (state, action) => {
                state.error = action.payload as string
            })
    },
})

export default adminBookingsSlice.reducer