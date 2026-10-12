import { configureStore } from "@reduxjs/toolkit";
import signUpReducer from './reducers/signUpSlice';
import loginReducer from './reducers/loginSlice'

const store = configureStore ({
    reducer : {
        signUp: signUpReducer,
        login: loginReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store