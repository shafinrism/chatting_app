import { Link, useNavigate } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { BsChatFill } from "react-icons/bs";
import { IoNotifications, IoLogOut } from "react-icons/io5";
import { MdFileUpload } from "react-icons/md";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { userLoginInfo } from "../slices/userSlice";
import { createRef, useState } from "react";
import { Button_v_3} from "./Button";
import  { Cropper} from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";



const Navbar = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storage = getStorage();

  // react cropper start
  const [image, setImage] = useState("");
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef();
  // react cropper end



  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const [showModal,setShowModal] = useState(false) 

  const closeModal =()=>{
    setShowModal(false)
  }

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
        dispatch(userLoginInfo(null));
        localStorage.removeItem("user");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  // react cropper start
  const handleProfilePicture = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      
    };
    reader.readAsDataURL(files[0]);
    

  };
  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      const storageRef = ref(storage, auth.currentUser.uid);
      const message4 = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, 'data_url').then((snapshot) => {
      // console.log('Uploaded a data_url string!');

      getDownloadURL(storageRef).then((downloadURL) =>{
        updateProfile(auth.currentUser,{
          photoURL: downloadURL
        })
        dispatch(userLoginInfo({...data,photoURL : downloadURL}))
        localStorage.setItem("user",JSON.stringify({...data,photoURL : downloadURL}))
        setShowModal(false)
      })

      
});

    }
    
  };
  // react cropper end

  return (
    <nav className="py-[5px] bg-primary">
      <div className="container mx-auto flex items-center justify-between">
        <div className="profile_and_name">
          <div className="profile_img relative group">
            <img className="w-full" src={data.photoURL} alt="profile_picture" />
            {/* <h2 className="default_profile_picture group-hover:opacity-0">
              {data?.displayName[0]}
            </h2> */}
            <div onClick={()=>setShowModal(true)} className="overlay hidden group-hover:block">
              <MdFileUpload />
            </div>
          </div>

          <h2>{data?.displayName}</h2>
        </div>
        <div className="menu_items">
          <Link to="/home">
            <IoMdHome />
          </Link>
          <Link to="/chat">
            <BsChatFill />
          </Link>
          <Link to="/notification">
            <IoNotifications />
          </Link>
          <div className="cursor-pointer">
            <IoLogOut onClick={handleLogOut} />
          </div>
        </div>
      </div>
      {/* modal start */}
      { showModal && (
      <div className="modal">
        <div className="update_profile_img">
            <h2>Update Your Profile Picture</h2>
            <input onChange={handleProfilePicture} className="my-5" type="file" />
            
            <div className="h-[100px] w-[100px] overflow-hidden rounded-full mx-auto my-3">
            <div className="img-preview w-full h-full"/>
            </div>
            
            
          
            
           {
            image&&
            <Cropper
            ref={cropperRef}
            style={{ height: 400, width: "100%" }}
            zoomTo={0.5}
            initialAspectRatio={1}
            preview=".img-preview"
            src={image}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
            guides={true}
          />
           }
            <div className="flex w-[55%] mx-auto gap-3 mt-3 ">
              <button onClick={getCropData} className="btn_v_3">Upload</button>
              <button onClick={closeModal} className="btn_v_4" >Cancel</button>
            </div>
        </div>
      </div>
      )}
      {/* modal end */}
    </nav>
  );
};

export default Navbar;
