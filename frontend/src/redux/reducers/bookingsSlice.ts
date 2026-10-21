import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { getConfig } from '../../utils/getConfig'
import type { Booking } from '../../types/booking';


export interface BookingsState {
    bookings : Booking[];
     loading: boolean;
    error: string | null;
}

const initialState: BookingsState = {
    bookings: [],
    loading: false,
    error: null,
}


// export const bookingsSlice = createSlice ({
//     name: 'bookings',
//     initialState,
//     reducers{},
  

    
// })

// export default bookingsSlice.reducer

