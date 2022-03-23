import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import lockImg from "../Images/icon.png";
import { updateNumberState } from "../Redux/slices/registerReducer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Register = () => {
  const navigate = useNavigate();
  const store = useSelector((state) => {
    return state;
  });
  const dispatch = useDispatch();

  const [number, setNumber] = useState("");

  async function submitNumber(e) {
    e.preventDefault();
    if (!number) {
      toast.error("Please Enter Number");
      setNumber("");
      return false;
    }
    if (!number.match(/^[6-9][0-9]{9}$/)) {
      toast.error("Number is Invalid");
      setNumber("");
      return false;
    } else {
      const otpstatus = await axios.post(
        "/register",
        { number },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (otpstatus.data.status === 1) {
        dispatch(updateNumberState(number));
        toast.success(otpstatus.data.message);
        return true;
      } else {
        toast.error(otpstatus.data.message);
        return false;
      }
    }
  }

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/profile");
    }
  }, []);

  return (
    <>
      <Container
        className="container  d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <form onSubmit={submitNumber}>
          <div className="card py-4 px-4">
            <div className="text-center">
              <img src={lockImg} width={60} />
            </div>
            <div className="text-center mt-3">
              <span className="info-text">Enter your mobile number</span>
            </div>
            <div className="position-relative mt-3 form-input">
              <input
                type="number"
                className="form-control text-center"
                value={number}
                onChange={(e) => {
                  setNumber(e.target.value);
                }}
              />
              <i className="bx bxs-phone" />
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

// STYLES

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

// STYLES

export default Register;
