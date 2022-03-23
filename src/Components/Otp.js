import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import lockImg from "../Images/icon.png";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { updateauth } from "../Redux/slices/auth";

import { updateNumberState } from "../Redux/slices/registerReducer";



const Otp = ({ number }) => {
  const numberStatus=useSelector((store)=>{
    return store
  })
  const dispatch=useDispatch()
  console.log(numberStatus)
  const navigate=useNavigate();
  
  console.log(number)
  async function updateOtp(e)
  {
    e.preventDefault()
    if(!otp){return toast.error('Please enter otp')}
    if(!otp.match(/^[0-9]{6}$/)){return toast.error("Invalid OTP")}
    else{
      const {data}=await axios.post('/login',{number,otp},{headers:{"Content-Type":"application/json"}})
      console.log(data)
      if(data.status===1)
      {
        console.log(data)
        toast.success('login success');
        setOtp('');
        localStorage.setItem('chat-app-user',JSON.stringify(data.data));
        navigate('/profile')
        dispatch(updateNumberState(false))
        
      }
      else{
        toast.error(data.message);
      }
    }


  }  
  const [otp, setOtp] = useState('');
  
  return (
    <>
      <Container
        className="container  d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <form onSubmit={updateOtp} >
        <div className="card py-4 px-4">
          <div className="text-center">
            <img src={lockImg} width={60} />
          </div>
          <div className="text-center mt-3">
            <span className="info-text">Enter OTP</span>
          </div>
          <div className="position-relative mt-3 form-input">
            <input className="form-control" value={otp} onChange={(e)=>{setOtp(e.target.value)}}/> <i className="" />
          </div>
          <div className=" mt-5 d-flex justify-content-between align-items-center">
            <button className="go-button m-auto ">
              <i className="bx bxs-right-arrow-alt  " />
            </button>
          </div>
        </div>
        </form>
      </Container>
    </>
  );
};

const Container = styled.div`
  /* width: 350px; */
  /* padding: 10px; */
  border: none;
  border-radius: 20px;
  .form-input input {
    height: 45px;
    box-sizing: border-box;

    border: 2px solid #eee;
    transition: all 0.5s;
  }

  .form-input input:focus {
    box-shadow: none;
    border: 2px solid #000;
  }

  .info-text {
    font-size: 14px;
  }

  .form-input i {
    position: absolute;
    top: 14px;
    right: 10px;
  }

  .go-button {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    height: 50px;
    width: 50px;
    font-size: 29px;
    color: #fff;
    background-color: rgb(29, 152, 247);
    border-radius: 50%;
    transition: all 0.5s;
  }

  .go-button:hover {
    background-color: rgba(29, 152, 247, 0.7);
  }
`;

export default Otp;
