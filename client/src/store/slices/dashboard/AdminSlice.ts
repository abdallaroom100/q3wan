import { createSlice } from "@reduxjs/toolkit";

const initialState: Record<string, any> = {
  admin: null,
};
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    assignAdmin: (state, action) => {
      state.admin = action.payload;
    },
    logoutAdmin:(state)=>{
      state.admin = null
    }
  },
});

export const { assignAdmin,logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
