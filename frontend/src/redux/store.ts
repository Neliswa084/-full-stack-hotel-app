import { configureStore } from "@reduxjs/toolkit";
import signUpReducer from './reducers/signUpSlice';
import loginReducer from './reducers/loginSlice';
import hotelReducer from './reducers/hotelSlice';
import adminReducer from './reducers/adminSlice'

const store = configureStore ({
    reducer : {
        signUp: signUpReducer,
        login: loginReducer,
        hotels: hotelReducer,
        admin : adminReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store