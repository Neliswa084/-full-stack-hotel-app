import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { Review } from '../../types/hotel'
import { getConfig } from '../../utils/getConfig'

export interface ReviewsState {
    reviews: Review[];
    average: number;
    total: number;
    error: string | null;
}

const initialState: ReviewsState = {
    reviews: [],
    average: 0,
    total: 0,
    error: null,
}

export const fetchReviews = createAsyncThunk(
    'reviews/fetchReviews',
    async (hotelId: string, thunkAPI) => {
        try {
            const response = await axios.get(`/api/hotels/${hotelId}/reviews`)
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews')
        }
    }
)

export const addReview = createAsyncThunk(
    'reviews/addReview',
    async ({ hotelId, rating, comment }: { hotelId: string; rating: number; comment: string }, thunkAPI) => {
        try {
            const response = await axios.post(
                `/api/hotels/${hotelId}/reviews`,
                { rating, comment },
                getConfig()
            )
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add review')
        }
    }
)

export const reviewsSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.reviews = action.payload.reviews
                state.average = action.payload.average
                state.total = action.payload.total
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.error = action.payload as string
            })

            .addCase(addReview.pending, (state) => {
                state.error = null
            })
            .addCase(addReview.rejected, (state, action) => {
                state.error = action.payload as string
            })
    },
})

export default reviewsSlice.reducer