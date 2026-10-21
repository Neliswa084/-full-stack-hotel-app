import { configureStore } from "@reduxjs/toolkit";
import signUpReducer from './reducers/signUpSlice';
import loginReducer from './reducers/loginSlice';
import hotelReducer from './reducers/hotelSlice';
import adminReducer from './reducers/adminSlice';
import adminHotelReducer from './reducers/adminHotelsSlice';
import roomsReducer from './reducers/roomsSlice';
import photosReducer from './reducers/photosSlice';
import amenitiesReducer from './reducers/amenitiesSlice';
import usersReducer from './reducers/adminUsersSlice'

const store = configureStore ({
    reducer : {
        signUp: signUpReducer,
        login: loginReducer,
        hotels: hotelReducer,
        admin : adminReducer,
        adminHotels: adminHotelReducer,
        rooms: roomsReducer,
        photos: photosReducer,
        amenities: amenitiesReducer,
        users: usersReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store