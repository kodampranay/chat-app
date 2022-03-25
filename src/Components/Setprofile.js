import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { updateauth } from "../Redux/slices/auth";
import { updateNumberState } from "../Redux/slices/registerReducer";
const Setprofile = () => {    

  
   const navigate=useNavigate()



  //PROFILE NAME AND IMAGE

  const [profileimg, setProfileimg] = useState({
    image:'',
    file:''
  });
  const [myName, setMyname] = useState("");



  //IMAGE SELECT AND CHANGE

  function imageSelect() {
    const file = document.getElementById("image-file").click();
  }
  function uploadImage(e) {
    let img = e.target.files[0];
    
    if (
      img.type == "image/jpeg" ||
      img.type == "image/png" ||
      img.type == "image/bmp" ||
      img.type == "image/webp"
    ) {
      setProfileimg({
        image: URL.createObjectURL(img),
        file: e.target.files[0],
      });
    } else {
      toast.error("Please choose image format");
    }
    

    // console.log(img)
  }
  //PROFILE UPDATE

  async function updateProfile(e) {
    e.preventDefault();
    if (!myName) {
      return toast.error("Please Enter Your Name");
    }
    if (!profileimg) {
      return toast.error("Please Select Profile image");
    } else {

      // sending file along with data
      const form = new FormData();
      form.append("sampleFile", profileimg.file);
      form.append("myName", myName);
      console.log(form)
      const options = {
        method: 'POST',
        url: 'https://chat-nodeapp-backend.herokuapp.com/updateprofile',
        headers: {
          'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
          token: localStorage.getItem('chat-app-user')
        },
        data: form
      };
      
      axios.request(options).then(async function (response) {
        if(response.data.status===1)
        {
          toast.success('update success');
          setMyname('')
          setProfileimg('');
          await localStorage.setItem('chat-app-user',JSON.stringify(response.data.data))
          navigate('/contacts')
          
        }
      }).catch(function (error) {
        console.error(error);
      });

      // axios.post('/updateprofile',{},{headers:{token:localStorage.getItem('token'),"Content-Type:"}})
    }
  }

  //LOGOUT FUNCTIONALITY
  function logout()
  {
    toast.error('You are logouted')
    localStorage.clear();
    navigate('/')
  }


  //USE EFFECT TO CHECK TOKEN

  useEffect(async()=>
  {
    try{
      if(localStorage.getItem('chat-app-user'))
    {
      const {data}=await axios.get('https://chat-nodeapp-backend.herokuapp.com/auth',{headers:{token:localStorage.getItem('chat-app-user')}})
      if(data.status===1)
      {
        // console.log('true')
        // navigate('/profile')
      }
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
  },[localStorage])

  //USE EFFECT TO GET IMAGE AND NAME DATA

  useEffect(()=>
  {
    
    if(localStorage.getItem('chat-app-user'))
    {
      
      const user_info=JSON.parse(localStorage.getItem('chat-app-user'));
      
      if(user_info.name)
      {
        setMyname(user_info.name)
      }
      if(user_info.profileimg)
      {
        setProfileimg({...profileimg,image:'https://chat-nodeapp-backend.herokuapp.com'+user_info.profileimg})
        // navigate('/contacts')
      }

      
      

    }
  },[])
  


  return (
    <>
      
      
      
      <div  className="container mt-4">
        <div className="card mx-auto" style={{ maxWidth: 400 }}>
          <div className="card-header bg-transparent">
            <div className="navbar navbar-expand p-0">
              <ul className="navbar-nav me-auto align-items-center">
                <li className="nav-item"></li>
                <li className="nav-item">
                  <Link to="#!" className="nav-link">
                    <h4>Profile</h4>
                    
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <button onClick={logout}
                    type="button"
                    className="btn btn-light text-white"
                    style={{ backgroundColor: "#1D98F7" }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div
            className="card-body p-4 "
            style={{ height: 500, overflow: "auto" }}
          >
            <div className=" d-flex flex-column align-items-center justify-content-center mb-4">
              <div
                className="position-relative avatar w-25 h-25"
                style={{ border: "2px solid #fff" }}
              >
                <img
                  src={
                    profileimg.image
                      ? profileimg.image
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
                  }
                  className="img-fluid rounded-circle "
                  style={{ objectFit: "cover", width: "150px", height: "70px" }}
                  alt=""
                />
                <span
                  className="position-absolute rounded-circle"
                  style={{
                    right: 0,
                    bottom: 0,
                    padding: "5px 10px",
                    backgroundColor: "#1D98F7 ",
                    color: "white",
                  }}
                >
                  <i
                    onClick={imageSelect}
                    className="fas fa-thin fa-camera "
                  ></i>
                </span>
                <input
                  type="file"
                  id="image-file"
                  accept="image/*"
                  hidden
                  onChange={uploadImage}
                />
              </div>
              <div className="pe-2">
                <div>
                  <div className="card card-text d-inline-block p-2 px-3 m-1">
                    <div className="form-group d-flex align-item-center justify-content-center">
                      <input
                        type="text"
                        className="form-control border border-0"
                        placeholder="Your Name"
                        id="namechange"
                        value={myName}
                        onChange={(e) => setMyname(e.target.value)}
                      />
                      <i
                        className="fa fa-solid fa-pen m-auto"
                        onClick={() => {
                          document.getElementById("namechange").focus();
                        }}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pe-2">
                <div>
                  <div className="card card-text border border-0 d-inline-block p-2 px-3 m-1">
                    <button
                      className="btn btn-light text-white"
                      style={{ backgroundColor: "#1D98F7" }}
                      onClick={updateProfile}
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setprofile;
