import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/user"
import homeReducer from "./slices/home"
import adminReducer from "./slices/dashboard/AdminSlice"
const store  = configureStore({
    reducer:{
        user:userReducer,
        home:homeReducer,
        admin:adminReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store