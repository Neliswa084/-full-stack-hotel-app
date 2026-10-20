import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export interface Stats {
    hotels: number;
    users: number;
    bookings: number;
}

export interface AdminState {
    stats: Stats | null;
    bookings: any[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    stats: null,
    bookings: [],
    loading: false,
    error: null,
}

export const fetchDashboard = createAsyncThunk(
    'admin/fetchDashboard',
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem('token')
            const config = { headers: { Authorization: `Bearer ${token}` } }

            const statsResponse = await axios.get('/api/admin/stats', config)
            const bookingsResponse = await axios.get('/api/bookings', config)

            return {
                stats: statsResponse.data,
                bookings: bookingsResponse.data
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to load dashboard')
        }
    }
)

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboard.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.loading = false
                state.stats = action.payload.stats
                state.bookings = action.payload.bookings
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export default adminSlice.reducer