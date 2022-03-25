import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useEffect } from "react";
import {io} from 'socket.io-client'
import audiofile from '../music/request.mp3'

const Container = styled.div`
  a.nav-link {
    color: gray;
    font-size: 18px;
    padding: 0;
  }

  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid #dfd2d2;
    padding: 2px;
    flex: none;
  }

  input:focus {
    outline: 0px !important;
    box-shadow: none !important;
  }

  .card-text {
    border: 2px solid #ddd;
    border-radius: 8px;
  }
  .card-body {
    background-color: #fff;
  }
`;
const Contacts = () => {
  
  const [notifyuser,setNotifyuser]=useState(false);
  const [onlineusers,setOnlineusers]=useState([])
  const [notifications,setNotifications]=useState([])
  const [bell,setBell]=useState(false);
  const [request, sendRequest] = useState("");
  const [contacts, setContacts] = useState([]);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();
  const [contactnum, setContact] = useState("");

  async function addContact(e) {
    e.preventDefault();
    if (!contactnum) {
      toast.error("Please Enter Contact Number");
      setContact("");
    } else if (!contactnum.match(/^[6-9][0-9]{9}$/)) {
      toast.error("Please enter valid Contact");
      setContact("");
    } else {
      const request = await axios.get(`https://chat-nodeapp-backend.herokuapp.com/${contactnum}/send`, {
        headers: { token: localStorage.getItem("chat-app-user") },
      });
      if (request.data.status === 1) {
        toast.success(request.data.message);
        setContact("");
        navigate("/contacts");
        const socket=io('https://chat-nodeapp-backend.herokuapp.com')
        socket.emit('sendrequest',request.data.id)
      } else {
        toast.error(request.data.message);
        setContact("");
        navigate("/contacts");
      }
    }

    document.getElementById("close-btn").click();
  }

  function logout() {
    toast.error("You are logouted");
    localStorage.clear();
    navigate("/");
  }
  useEffect(async () => {
    
    const socket = io("https://chat-nodeapp-backend.herokuapp.com");
    socket.emit("userlist", JSON.parse(localStorage.getItem("chat-app-user")));
    socket.on('online',function (data){
      setOnlineusers(data)
    })
    socket.on('request',async(data)=>
    {
               
      setNotifyuser((prev)=>!prev)      
      toast.success('you got friend request') 
      navigate('/')  
      
      
    })
    socket.on('accepted',(data)=>
    {
      toast.success('Your Request was accepted');
      navigate('/')
    })
    const userdata = await axios.get("https://chat-nodeapp-backend.herokuapp.com/contacts", {
      headers: { token: localStorage.getItem("chat-app-user") },
    });
    console.log(userdata);
    setContacts(userdata.data.data);
    setFriends(userdata.data.friends);
  }, []);


  // clicked bell
  function clickedBell()
  {
    setBell(!bell)
  }

  useEffect(async()=>
  {
    const {data}=await axios.get('https://chat-nodeapp-backend.herokuapp.com/notifications',{headers:{token:localStorage.getItem('chat-app-user')}})
    if(data.status===1){
      setNotifications(data.data)
    }
  },[notifyuser])

  //accepting user

  async function accept(notify){
     const {data}=await axios.get(`/${notify}/accept`,{headers:{token:localStorage.getItem('chat-app-user')}})
     if(data.status===1)
     {
       toast.success(data.message)
       const socket=io("https://chat-nodeapp-backend.herokuapp.com")
       socket.emit('accept',notify)
       navigate('/')
     }
     else{
       toast.error(data.message)
       navigate('/')
     }
  }
  async function cancel(notify){
    const {data}=await axios.get(`https://chat-nodeapp-backend.herokuapp.com/${notify}/cancel`,{headers:{token:localStorage.getItem('chat-app-user')}})
    if(data.status===1)
    {
      toast.success(data.message)
      navigate('/')
    }
    else{
      toast.error(data.message)
      navigate('/')
    }
 }
  return (
    <>
      <Container className="container mt-4">
        <div className="card mx-auto" style={{ maxWidth: 400 }}>
          <div className="card-header bg-transparent">
            <div className="navbar navbar-expand p-0">
              <ul className="navbar-nav me-auto align-items-center">
                <li className="nav-item"></li>
                <li className="nav-item">
                  <Link to="#!" className="nav-link">
                    <h4>Contacts</h4>
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                <button
                    onClick={()=>navigate('/setprofile')}
                    type="button"
                    className="btn btn-light text-dark"
                    style={{ backgroundColor: "#f1f1f1" }}
                  >
                    <i className="fa fa-user "></i>
                  </button>
                  <button
                    onClick={logout}
                    type="button"
                    className="btn btn-light text-white"
                    style={{ backgroundColor: "#1D98F7" }}
                  >
                    Logout
                  </button>
                  <button
                    onClick={clickedBell}
                    type="button"
                    className="btn btn-light text-white"
                    style={{ backgroundColor: "#1D98F7" }}
                  >
                    <i className=" fa fa-solid fa-bell"></i>
                    <span className="badge badge-light text-dark">{notifications.length>0&&notifications.length}</span>
                    <span className="sr-only">unread messages</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    style={{ backgroundColor: "#1D98F7", color: "white" }}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    <i className="fas fa-thin fa-address-book"></i>
                  </button>
                </li>
              </ul>
            </div>
            
            <div  className={bell?"container d-flex  align-item-center justify-content-end my-2 mr-0":'d-none'}style={{flexDirection:'column'}}>
              {
              notifications.length>0&&notifications.map((notify)=>
              
                contacts.length>0&&contacts.map((user)=>
                notify == user._id && (
                  
                   (<span   className="alert alert-dark " role="alert">
                {user.number} (<span className="text-center"> {user.name}</span>)
                <div className="d-flex justify-content-between"><button className="btn btn-sm btn-success m-2"onClick={()=>accept(notify)}>Accept</button>
                <button className="btn btn-sm btn-danger m-2" onClick={()=>cancel(notify)}>Cancel</button></div>
              </span>)
              
                ) )
              
              )
            }

            {/* no notification */}
            {
              notifications.length==0&&
              
                
                <span   className="alert alert-dark text-center " role="alert">
                 (<span className="text-center  "> No Notifications</span>)
               
              </span>
              
              
            }
            </div>
          </div>
          <div
            className="card-body d-flex p-4"
            style={{ height: 500, overflow: "auto", flexDirection: "column" }}
          >
            {contacts.length === 0 && (
              <div className="spinner-border m-auto" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
            {friends.length > 0 &&
              friends.map(
                (id) =>
                  contacts.length > 0 &&
                  contacts.map((contact) => {
                    return (
                      id == contact._id && (
                        <div onClick={()=>{navigate(`/chat`,{state:contact})} }className="d-flex align-items-baseline mb-4" style={{borderBottom: "1px solid grey",
                        paddingBottom: "9px"}}>
                          <div className="position-relative avatar">
                            <img
                              src={
                                contact.profileimg
                                  ? 'https://chat-nodeapp-backend.herokuapp.com'+contact.profileimg
                                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
                              }
                              className="img-fluid rounded-circle"
                              alt=""
                              style={{ width: "100%", height: "100%" }}
                            />
                            <span className={onlineusers.includes(contact._id)?"position-absolute bottom-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle":"position-absolute bottom-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"}>
                              <span className="visually-hidden">
                                New alerts
                              </span>
                            </span>
                          </div>
                          <div className="pe-2">
                            <div>
                              <div className="card card-text d-inline-block p-2 px-3 m-1">
                                {contact.name ? contact.name : contact.number}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    );
                  })
              )}

              {friends.length==0&& <div className="text-center d-flex align-item-center justify-content-center">No Contacts</div>}
          </div>
        </div>
      </Container>

      <hr />

      {/* pop up box */}

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                id="close-btn"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form onSubmit={addContact}>
              <div className="modal-body">
                <div className="pe-2">
                  <div>
                    <div className="card card-text  p-2 px-3 m-1">
                      <div className="form-group d-flex align-item-center justify-content-center">
                        <input
                          type="number"
                          className="form-control border border-0 "
                          placeholder="Enter Contact"
                          value={contactnum}
                          onChange={(e) => {
                            setContact(e.target.value);
                          }}
                          placeholder="Enter Contact Number "
                          id="number"
                          autoComplete="off"
                        />
                        <i
                          className="fa fa-solid fa-pen m-auto"
                          onClick={() => {
                            document.getElementById("number").focus();
                          }}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-light"
                  style={{ backgroundColor: "#1D98F7 ", color: "white" }}
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacts;
