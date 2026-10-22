import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { getConfig } from '../../utils/getConfig'
import type { Amenity } from '../../types/hotel';

export interface AmenitiesState {
    allAmenities: Amenity[];
    hotelAmenities: Amenity[];
    error: string | null;
    saved: boolean;
}

const initialState: AmenitiesState = {
    allAmenities: [],
    hotelAmenities: [],
    error: null,
    saved: false,
}

export const createAmenity = createAsyncThunk(
    'amenities/createAmenity',
    async (name: string, thunkAPI) => {
        try {
            const response = await axios.post('/api/amenities', { name }, getConfig())
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add amenity')
        }
    }
)
export const fetchAllAmenities = createAsyncThunk(
    'amenities/fetchAllAmenities',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/api/amenities')
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch amenities')
        }
    }
)

export const fetchHotelAmenities = createAsyncThunk(
    'amenities/fetchHotelAmenities',
    async (hotelId: string, thunkAPI) => {
        try {
            const response = await axios.get(`/api/hotels/${hotelId}/amenities`)
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch hotel amenities')
        }
    }
)

export const saveHotelAmenities = createAsyncThunk(
    'amenities/saveHotelAmenities',
    async ({ hotelId, amenityIds }: { hotelId: string; amenityIds: number[] }, thunkAPI) => {
        try {
            const response = await axios.put(
                `/api/hotels/${hotelId}/amenities`,
                { amenity_ids: amenityIds },
                getConfig()
            )
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to save amenities')
        }
    }
)

export const amenitiesSlice = createSlice({
    name: 'amenities',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllAmenities.fulfilled, (state, action) => {
                state.allAmenities = action.payload
            })
            .addCase(fetchHotelAmenities.fulfilled, (state, action) => {
                state.hotelAmenities = action.payload
                state.saved = false
            })
            .addCase(saveHotelAmenities.pending, (state) => {
                state.error = null
                state.saved = false
            })
            .addCase(saveHotelAmenities.fulfilled, (state, action) => {
                state.hotelAmenities = action.payload.amenities
                state.saved = true
            })
            .addCase(saveHotelAmenities.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(createAmenity.pending, (state) => {
                state.error = null
            })
            .addCase(createAmenity.rejected, (state, action) => {
                state.error = action.payload as string
            })
    },
})

export default amenitiesSlice.reducer