import { Link, useNavigate } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { BsChatFill } from "react-icons/bs";
import { IoNotifications, IoLogOut } from "react-icons/io5";
import { MdFileUpload } from "react-icons/md";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { userLoginInfo } from "../slices/userSlice";
import { createRef, useState } from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";

const Navbar = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storage = getStorage();

  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

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

  const [image, setImage] = useState("");
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef();

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
      const message4 = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          });
          dispatch(userLoginInfo({ ...data, photoURL: downloadURL }));
          localStorage.setItem(
            "user",
            JSON.stringify({ ...data, photoURL: downloadURL })
          );
          setShowModal(false);
        });
      });
    }
  };

  return (
    <nav className="py-[5px] bg-primary">
      <div className="container mx-auto flex items-center justify-between">
        <div className="profile_and_name flex items-center">
          <div className="profile_img relative group mr-3">
            <img className="w-full" src={data.photoURL} alt="profile_picture" />
            <div
              onClick={() => setShowModal(true)}
              className="overlay hidden group-hover:block"
            >
              <MdFileUpload />
            </div>
          </div>
          <h2 className="text-white">{data?.displayName}</h2>
        </div>
        <div className="menu_items flex items-center">
          <Link to="/home" className="text-white mr-4">
            <IoMdHome />
          </Link>
          <Link to="/chat" className="text-white mr-4">
            <BsChatFill />
          </Link>
          <Link to="/notification" className="text-white mr-4">
            <IoNotifications />
          </Link>
          <div className="cursor-pointer text-white">
            <IoLogOut onClick={handleLogOut} />
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="update_profile_img bg-white p-8 rounded-lg">
            <h2 className="text-lg font-bold mb-4">
              Update Your Profile Picture
            </h2>
            <input onChange={handleProfilePicture} type="file" />
            {image && (
              <Cropper
                ref={cropperRef}
                src={image}
                aspectRatio={1}
                preview=".img-preview"
                guides={true}
                zoomable={true}
                cropBoxResizable={true}
              />
            )}
            <div className="flex justify-center mt-4">
              <button onClick={getCropData} className="btn_v_3 mr-4">
                Upload
              </button>
              <button onClick={closeModal} className="btn_v_4">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
