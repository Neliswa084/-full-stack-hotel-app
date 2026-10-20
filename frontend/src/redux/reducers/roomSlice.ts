import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { getConfig } from '../../utils/getConfig'
import type { Room } from '../../types/hotel';

export interface RoomsState {
    rooms: Room[];
    loading: boolean;
    error: string | null;
}

const initialState: RoomsState = {
    rooms: [],
    loading: false,
    error: null,
}



export const fetchRooms = createAsyncThunk(
    'rooms/fetchRooms',
    async (hotelId: string, thunkAPI) => {
        try {
            const response = await axios.get(`/api/hotels/${hotelId}/rooms`)
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch rooms')
        }
    }
)

export const addRoom = createAsyncThunk(
    'rooms/addRoom',
    async ({ hotelId, room }: { hotelId: string; room: any }, thunkAPI) => {
        try {
            const response = await axios.post(`/api/hotels/${hotelId}/rooms`, room, getConfig())
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add room')
        }
    }
)

export const updateRoom = createAsyncThunk(
    'rooms/updateRoom',
    async ({ id, room }: { id: number; room: any }, thunkAPI) => {
        try {
            const response = await axios.put(`/api/rooms/${id}`, room, getConfig())
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update room')
        }
    }
)

export const deleteRoom = createAsyncThunk(
    'rooms/deleteRoom',
    async (id: number, thunkAPI) => {
        try {
            const response = await axios.delete(`/api/rooms/${id}`, getConfig())
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete room')
        }
    }
)

export const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRooms.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.loading = false
                state.rooms = action.payload
            })
            .addCase(fetchRooms.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(addRoom.pending, (state) => {
                state.error = null
            })
            .addCase(addRoom.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(updateRoom.pending, (state) => {
                state.error = null
            })
            .addCase(updateRoom.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(deleteRoom.pending, (state) => {
                state.error = null
            })
            .addCase(deleteRoom.rejected, (state, action) => {
                state.error = action.payload as string
            })
    },
})

export default roomsSlice.reducer