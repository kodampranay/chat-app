import { createSlice } from "@reduxjs/toolkit"

const initialState={
    numberStatus:false
}
const registerSlice=createSlice(
    {
        name:"register",
        initialState:initialState,
        reducers:{
            updateNumberState:(state,action)=>{
                state.numberStatus=action.payload
            }
            
        }
    }
)
export const{updateNumberState}=registerSlice.actions;
export default registerSlice.reducer