import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { Hotel } from '../../types/hotel'

const getConfig = () => {
    const token = localStorage.getItem('token')
    return { headers: { Authorization: `Bearer ${token}` } }
}

export interface AdminHotelsState {
    hotels: Hotel[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminHotelsState = {
    hotels: [],
    loading: false,
    error: null,
}

export const fetchAdminHotels = createAsyncThunk(
    'adminHotels/fetchAdminHotels',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/api/admin/hotels', getConfig())
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch hotels')
        }
    }
)

export const createHotel = createAsyncThunk(
    'adminHotels/createHotel',
    async (hotel: Hotel, thunkAPI) => {
        try {
            const response = await axios.post('/api/hotels', hotel, getConfig())
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add hotel')
        }
    }
)

export const updateHotel = createAsyncThunk(
    'adminHotels/updateHotel',
    async (hotel: Hotel, thunkAPI) => {
        try {
            const response = await axios.put(`/api/hotels/${hotel.id}`, hotel, getConfig())
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update hotel')
        }
    }
)

export const deleteHotel = createAsyncThunk(
    'adminHotels/deleteHotel',
    async (id: number, thunkAPI) => {
        try {
            const response = await axios.delete(`/api/hotels/${id}`, getConfig())
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete hotel')
        }
    }
)

export const adminHotelsSlice = createSlice({
    name: 'adminHotels',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminHotels.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAdminHotels.fulfilled, (state, action) => {
                state.loading = false
                state.hotels = action.payload
            })
            .addCase(fetchAdminHotels.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(createHotel.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(updateHotel.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(deleteHotel.rejected, (state, action) => {
                state.error = action.payload as string
            })
    },
})

export default adminHotelsSlice.reducer