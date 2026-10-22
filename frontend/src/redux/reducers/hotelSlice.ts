import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { HotelCardData, Hotel } from '../../types/hotel'


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
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`/api/hotels`)
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch hotels'
            )
        }
    })

export const fetchHotelById = createAsyncThunk(
    'hotels/fetchHotelById',
    async (id: string, thunkAPI) => {
        try {
            const response = await axios.get(`/api/hotels/${id}`)
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch hotel')
        }
    }
)

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

            //Fetch hotel by Id 

            .addCase(fetchHotelById.pending, (state) => {
                state.loading = true
                state.error = null
                state.selectedHotel = null
            })
            .addCase(fetchHotelById.fulfilled, (state, action) => {
                state.loading = false
                state.selectedHotel = action.payload
            })
            .addCase(fetchHotelById.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export default hotelSlice.reducer
