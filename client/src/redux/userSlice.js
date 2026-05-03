 import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"user",
    initialState:{
        userData:null
    },
    reducers:{
        setUserData:(state,action)=>{
          state.userData=action.payload
        }
    }

})

export const {setUserData}=userSlice.actions
export default userSlice.reducer

// used redux toolkit official site for all ideas here and how to