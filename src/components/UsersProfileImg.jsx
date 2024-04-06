
import { ref, getDownloadURL, getStorage } from "firebase/storage";
import { useEffect, useState } from "react";



const UsersProfileImg = ({imgId}) => {
  let [profilePicture,setProfilePicture] = useState('')
  
  const storage = getStorage()
  const pictureRef = ref(storage,imgId)

  useEffect(()=>{
      getDownloadURL(pictureRef)
      .then((url)=>{
        setProfilePicture(url)
      })
      .catch((error)=>{
        console.log(error);
      })
  },[])
 

  return (
    <div>
      <img src={profilePicture} alt="" />
    </div>
  );
};

export default UsersProfileImg;