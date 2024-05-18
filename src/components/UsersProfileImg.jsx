import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";

const UsersProfileImg = ({ imgId }) => {
  const [profilePicture, setProfilePicture] = useState('');
  const storage = getStorage();
  const pictureRef = ref(storage, imgId);

  useEffect(() => {
    getDownloadURL(pictureRef)
      .then((url) => {
        setProfilePicture(url);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [imgId]);

  return (
    <div className="relative w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40">
      <img
        src={profilePicture}
        alt=""
        className="w-full h-full object-cover rounded-full"
      />
      {/* Optional: Add a loading spinner or placeholder */}
      {/* {profilePicture ? (
        <img
          src={profilePicture}
          alt=""
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )} */}
    </div>
  );
};

export default UsersProfileImg;
