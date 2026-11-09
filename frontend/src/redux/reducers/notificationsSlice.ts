import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { getConfig } from '../../utils/getConfig'
import type { Notification } from '../../types/notification'

export interface NotificationsState {
    notifications: Notification[];
    error: string | null;
}

const initialState: NotificationsState = {
    notifications: [],
    error: null,
}

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/api/notifications', getConfig())
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications')
        }
    }
)

export const markNotificationRead = createAsyncThunk(
    'notifications/markNotificationRead',
    async (id: number, thunkAPI) => {
        try {
            await axios.patch(`/api/notifications/${id}/read`, {}, getConfig())
            return id
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update notification')
        }
    }
)

export const markAllNotificationsRead = createAsyncThunk(
    'notifications/markAllNotificationsRead',
    async (_, thunkAPI) => {
        try {
            await axios.patch('/api/notifications/read-all', {}, getConfig())
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update notifications')
        }
    }
)

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(markNotificationRead.fulfilled, (state, action) => {
                const notification = state.notifications.find((n) => n.id === action.payload)
                if (notification) {
                    notification.is_read = true
                }
            })
            .addCase(markAllNotificationsRead.fulfilled, (state) => {
                state.notifications.forEach((n) => {
                    n.is_read = true
                })
            })
    },
})

export default notificationsSlice.reducer