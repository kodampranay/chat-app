import Register from './Components/Register'
import Profile from './Components/Profile'
import Contacts from './Components/Contacts'
import Otp from './Components/Otp'
import Chat from './Components/Chat'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'

// import { useState } from 'react';
import { Routes,Route, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'
// import { updateNumberState } from './Redux/slices/registerReducer'
import { updateauth } from './Redux/slices/auth'
import { useEffect } from 'react';
import { io } from "socket.io-client";






//CHCHEING LOCALSTORAGE CHANGES


function App() {


  // connecting to socke

  
  

  const navigate=useNavigate()
  // NUMBER STATUS

  const numberstatus=useSelector((state)=>
  {
    return state.register.numberStatus;
  })
  console.log(numberstatus)



  
  
 //FOR EVERY LOCALE STORAGE CHANGES THIS EVENT TRIGGER
 window.addEventListener('storage',async()=>
 {
   console.log('this event triggered')
   try{
    if(localStorage.getItem('chat-app-user'))
  {
    const {data}=await axios.get('/auth',{headers:{token:localStorage.getItem('chat-app-user')}})
    console.log(data)
  }
  else{
    toast.error('you are not authenticated');
    await localStorage.clear();
    navigate('/')
  }

  }
  catch(err)
  {
    localStorage.clear();
    navigate('/')
  }
  
 })
 useEffect(()=>
 {
  const socket = io("https://node-api-chat-backend.herokuapp.com/");

  socket.emit('newuser',(JSON.parse(localStorage.getItem('chat-app-user'))))
  
 },[])

 
 console.log(localStorage.getItem('chat-app-user'))
//  console.log(typeof(localStorage.getItem('chat-app-user')))
  return (
    <>    
    <Toaster/>
    <Routes>
      <Route path='/' element={numberstatus?<Otp number={numberstatus}/>:<Register/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/contacts' element={<Contacts/>}/>
      <Route path='/chat' element={<Chat/>}/>
      <Route path='*' element={<Navigate to={'/'}/>}/>
      
      
      
    </Routes>
    </>
  );
}

export default App;
