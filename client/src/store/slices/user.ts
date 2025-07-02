import {createSlice} from "@reduxjs/toolkit"


const initialState = {

    user:null,
    isLoading:true
}


const  userSlice =  createSlice({
    name:"user",
    initialState,
    reducers:{
        setUser:(state,action)=>{
        state.user = action.payload
        },
        setIsLoading:(state,action)=>{
            state.isLoading = action.payload
        },
        logOut:(state)=>{
            state.user = null
        }
    }
})


export const {setUser,logOut} = userSlice.actions
export default userSlice.reducer