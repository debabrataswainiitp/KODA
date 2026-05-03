import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./userSlice"
export const store=configureStore({
    reducer:{  // reducer is an object containing all slices
      user:userSlice
    }
})