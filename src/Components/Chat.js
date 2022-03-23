import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import blankimg from "./../Images/blankimg.webp";
import { io } from "socket.io-client";

const Chat = () => {
  let num = 0;
  const [recieved, setRecieved] = useState(null);
  const [myimage, setMyimage] = useState();
  const [message, setMessage] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(true);
  // console.log(state);

  useEffect(async () => {
    const socket = io("https://node-api-chat-backend.herokuapp.com/");
    socket.on("msgnotification", (data) => {
      setRecieved(data)
    });

    if (!state) {
      navigate("/contacts");
    }
    if (localStorage.getItem("chat-app-user")) {
      setMyimage(JSON.parse(localStorage.getItem("chat-app-user")).profileimg);
      const { data } = await axios.get("/auth", {
        headers: { token: localStorage.getItem("chat-app-user") },
      });
      if (data.status == 1) {
      } else {
        localStorage.clear();
        navigate("/");
      }
      // navigate('/')
    } else {
      navigate("/");
    }
  }, []);
  useEffect(async () => {
    const { data } = await axios.get(`/${state._id}/chat`, {
      headers: { token: localStorage.getItem("chat-app-user") },
    });
    if (data) {
      setLoading(false);
    }
    if (data.status == 1) {
      // console.log(data.messages);
      setChat(data.messages);
    }
    var myDiv = document.getElementById("chat-container");
    myDiv.scrollTop = myDiv.scrollHeight;
  }, [recieved]);

  async function submitMsg(e) {
    e.preventDefault();
    if (!message) {
      toast.error("Please add text");
      return false;
    }
    const { data } = await axios.put(
      `/${state._id}/sendmessage`,
      { msg: message },
      {
        headers: { token: localStorage.getItem("chat-app-user") },
      }
    );
    if (data.status === 1) {
      // console.log(data);

      setChat(data.messages);
      // setChat([d])

      var myDiv = document.getElementById("chat-container");
      myDiv.scrollTop = myDiv.scrollHeight;
      const socket = io("https://node-api-chat-backend.herokuapp.com/");
      socket.emit("sendmessage", state._id);
      setMessage("");
    }
  }

  return (
    <>
      {state && (
        <Container className="mt-4">
          <div className="card mx-auto" style={{ maxWidth: 400 }}>
            <div className="card-header bg-transparent">
              <div className="navbar navbar-expand p-0">
                <ul className="navbar-nav me-auto align-items-center">
                  <ul className="navbar-nav ms-auto">
                    <li
                      className="nav-item"
                      onClick={() => navigate("/contacts")}
                    >
                      <a href="#!" className="nav-link">
                        <i className="fas fa-arrow-left" />
                      </a>
                    </li>
                  </ul>
                  <li className="nav-item">
                    <a href="#!" className="nav-link">
                      <div
                        className="position-relative"
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          border: "2px solid #dfd2d2",
                          padding: 2,
                        }}
                      >
                        <img
                          src={state.profileimg ? state.profileimg : blankimg}
                          className="img-fluid rounded-circle w-100 h-100"
                          alt
                        />
                        <span className="position-absolute bottom-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
                          <span className="visually-hidden">New alerts</span>
                        </span>
                      </div>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#!" className="nav-link">
                      {state.name ? state.name : state.number}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="card-body p-4"
              id="chat-container"
              style={{ height: 500, overflow: "auto" }}
            >
              {loading && (
                <div
                  className="spinner-border d-flex align-item-center justify-content-center m-auto"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}

              {chat && chat.length == 0 && (
                <span className="d-flex align-item-center justify-content-center">
                  No Messages
                </span>
              )}

              {chat &&
                chat.length > 0 &&
                chat.map((user) => (
                  <>
                    {user.left == 1 && (
                      <div className="d-flex align-items-baseline mb-4">
                        <div className="position-relative avatar">
                          <img
                            src={state.profileimg ? state.profileimg : blankimg}
                            className="img-fluid rounded-circle w-100 h-100"
                            alt
                          />
                          <span className="position-absolute bottom-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
                            <span className="visually-hidden">New alerts</span>
                          </span>
                        </div>
                        <div className="pe-2">
                          <div>
                            <div className="card card-text d-inline-block p-2 px-3 m-1">
                              {user.content}
                            </div>
                          </div>
                          <div>
                            <div className="small">{user.mtime}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {user.right == 1 && (
                      <div className="d-flex align-items-baseline text-end justify-content-end mb-4">
                        <div className="pe-2">
                          <div>
                            <div
                              className="card card-text d-inline-block p-2 px-3 m-1 "
                              style={{ maxWidth: "auto" }}
                            >
                              {user.content}
                            </div>
                          </div>
                          <div>
                            <div className="small">{user.mtime}</div>
                          </div>
                        </div>
                        <div className="position-relative avatar">
                          <img
                            src={myimage ? myimage : blankimg}
                            className="img-fluid rounded-circle w-100 h-100"
                            alt
                          />
                          <span className="position-absolute bottom-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
                            <span className="visually-hidden">New alerts</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ))}
            </div>
            <form onSubmit={submitMsg} className="mt-3">
              <div className="card-footer bg-white position-absolute w-100 bottom-0 m-0 p-1">
                <div className="input-group">
                  <div className="input-group-text bg-transparent border-0"></div>
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Write a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="input-group-text bg-transparent border-0"></div>
                  <div className="input-group-text bg-transparent border-0">
                    <button
                      type="submit"
                      className="btn btn-light text-secondary"
                    >
                      <i
                        className="fas fa-paper-plane"
                        style={{ color: "#1D98F7" }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Container>
      )}
    </>
  );
};

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
    word-break: break-all;
  }
  .card-body {
    background-color: #fff;
  }
`;

export default Chat;
