import { createSlice } from "@reduxjs/toolkit";

// if(localStorage.getItem('chat-app-user'))
// {
//     const authentication=localStorage.getItem('chat-app-user');
// }
// else{
//     const authentication=false

// }
var authentication;
localStorage.getItem('chat-app-user')?authentication=localStorage.getItem('chat-app-user'):authentication=false


const authSlice=createSlice(
    {
        name:'auth',
        initialState:authentication,
       reducers: {updateauth:(state,action)=>
        {
            state=action.payload
        }
    }
    }
)

export const {updateauth}=authSlice.actions;
export default authSlice.reducer