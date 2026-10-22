import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type {HotelCardData ,Hotel } from '../../types/hotel'


export interface HotelState {
    hotels: HotelCardData[];
    selectedHotel: Hotel | null;
    loading: boolean;
    error: string | null;
}

const initialState: HotelState = {
    hotels: [],
    selectedHotel: null,
    loading: false,
    error: null,
}



export const fetchHotels = createAsyncThunk(
    'hotels/fetchHotels',
    async ( _ , thunkAPI) => {
        try {
            const response = await axios.get(`/api/hotels`)
            return response.data
        } catch (error: any) {
    return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch hotels'
    )
    }
})

export const hotelSlice = createSlice({
    name: 'hotels',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHotels.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchHotels.fulfilled, (state, action) => {
                state.loading = false
                state.hotels = action.payload
            })
            .addCase(fetchHotels.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export default hotelSlice.reducer
    