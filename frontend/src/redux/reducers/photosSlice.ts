import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { getConfig } from '../../utils/getConfig'
import type { Photo } from '../../types/hotel';

export interface PhotosState {
    photos: Photo[];
    loading: boolean;
    error: string | null;
}

const initialState: PhotosState = {
    photos: [],
    loading: false,
    error: null,
}

export const fetchPhotos = createAsyncThunk(
    'photos/fetchPhotos',
    async (hotelId: string, thunkAPI) => {
        try {
            const response = await axios.get(`/api/hotels/${hotelId}/images`)
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch photos')
        }
    }
)

export const addPhoto = createAsyncThunk(
    'photos/addPhoto',
    async ({ hotelId, photo }: { hotelId: string; photo: any }, thunkAPI) => {
        try {
            const response = await axios.post(`/api/hotels/${hotelId}/images`, photo, getConfig())
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add photo')
        }
    }
)

export const updatePhoto = createAsyncThunk(
    'photos/updatePhoto',
    async ({ id, photo }: { id: number; photo: any }, thunkAPI) => {
        try {
            const response = await axios.put(`/api/images/${id}`, photo, getConfig())
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update photo')
        }
    }
)

export const deletePhoto = createAsyncThunk(
    'photos/deletePhoto',
    async (id: number, thunkAPI) => {
        try {
            const response = await axios.delete(`/api/images/${id}`, getConfig())
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete photo')
        }
    }
)

export const photosSlice = createSlice({
    name: 'photos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPhotos.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchPhotos.fulfilled, (state, action) => {
                state.loading = false
                state.photos = action.payload
            })
            .addCase(fetchPhotos.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(addPhoto.pending, (state) => {
                state.error = null
            })
            .addCase(addPhoto.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(updatePhoto.pending, (state) => {
                state.error = null
            })
            .addCase(updatePhoto.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(deletePhoto.pending, (state) => {
                state.error = null
            })
            .addCase(deletePhoto.rejected, (state, action) => {
                state.error = action.payload as string
            })
    },
})

export default photosSlice.reducer