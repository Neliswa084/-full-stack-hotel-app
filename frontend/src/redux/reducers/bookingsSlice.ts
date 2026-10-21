import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { getConfig } from '../../utils/getConfig'


export interface BookingsState {
    bookings : any[];
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

