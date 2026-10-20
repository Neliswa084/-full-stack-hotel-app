import { configureStore } from "@reduxjs/toolkit";
import signUpReducer from './reducers/signUpSlice';
import loginReducer from './reducers/loginSlice';
import hotelReducer from './reducers/hotelSlice';
import adminReducer from './reducers/adminSlice';
import adminHotelReducer from './reducers/adminHotelsSlice'

const store = configureStore ({
    reducer : {
        signUp: signUpReducer,
        login: loginReducer,
        hotels: hotelReducer,
        admin : adminReducer,
        adminHotels: adminHotelReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store