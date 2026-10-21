import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { AdminUser } from '../../types/user'
import { getConfig } from '../../utils/getConfig'


export interface AdminUserState {
    users: AdminUser[];
    loading: boolean;
    error: string | null;

}

const initialState: AdminUserState = {
    users: [],
    loading: false,
    error: null,
}

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`/api/admin/users`)
            return response.data
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch users'
            )
        }
    })

export const updateUserStatus = createAsyncThunk(
    'adminUsers/updateUserStatus',
    async ({ id, account_status }: { id: number; account_status: string }, thunkAPI) => {
        try {
            const response = await axios.patch(`/api/admin/users/${id}/status`, { account_status },getConfig())
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update status')

        }
    })



export const adminUserSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false
                state.users = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export default adminUserSlice.reducer