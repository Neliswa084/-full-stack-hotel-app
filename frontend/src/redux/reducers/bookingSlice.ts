import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { getConfig } from '../../utils/getConfig'
import type { Booking, NewBooking, CreatedBooking } from '../../types/booking'

export interface BookingState {
    bookings: Booking[];
    loading: boolean;
    error: string | null;
}

const initialState: BookingState = {
    bookings: [],
    loading: false,
    error: null,
}

export const createBooking = createAsyncThunk(
    'booking/createBooking',
    async (data: NewBooking, thunkAPI) => {
        try {
            const response = await axios.post<{ message: string; booking: CreatedBooking; nights: number }>(
                '/api/bookings',
                data,
                getConfig()
            )
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create booking')
        }
    }
)


export const fetchUserBooking = createAsyncThunk(
    'bookings/fetchBookingsByUser',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/api/bookings/my', getConfig())
            return response.data
        } catch (error: any) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch hotels'
            )
        }
    }
)

export const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createBooking.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createBooking.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            .addCase(fetchUserBooking.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUserBooking.fulfilled, (state, action) => {
                state.loading = false
                state.bookings = action.payload

            })
            .addCase(fetchUserBooking.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export default bookingSlice.reducer