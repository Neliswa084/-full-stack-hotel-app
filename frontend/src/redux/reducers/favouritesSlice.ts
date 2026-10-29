import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { getConfig } from '../../utils/getConfig'
import type { Favourite } from '../../types/hotel'

export interface FavouritesState {
    favourites: Favourite[];
    error: string | null;
}

const initialState: FavouritesState = {
    favourites: [],
    error: null,
}

export const fetchFavourites = createAsyncThunk(
    'favourites/fetchFavourites',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/api/favourites', getConfig())
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch favourites')
        }
    }
)

export const addFavourite = createAsyncThunk(
    'favourites/addFavourite',
    async (hotelId: number, thunkAPI) => {
        try {
            await axios.post(`/api/favourites/${hotelId}`, {}, getConfig())
            return hotelId
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add favourite')
        }
    }
)

export const removeFavourite = createAsyncThunk(
    'favourites/removeFavourite',
    async (hotelId: number, thunkAPI) => {
        try {
            await axios.delete(`/api/favourites/${hotelId}`, getConfig())
            return hotelId
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to remove favourite')
        }
    }
)

export const favouritesSlice = createSlice({
    name: 'favourites',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavourites.fulfilled, (state, action) => {
                state.favourites = action.payload
            })
            .addCase(fetchFavourites.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(removeFavourite.fulfilled, (state, action) => {
                state.favourites = state.favourites.filter((hotel) => hotel.id !== action.payload)
            })
            .addCase(addFavourite.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(removeFavourite.rejected, (state, action) => {
                state.error = action.payload as string
            })
    },
})

export default favouritesSlice.reducer