import { BsThreeDotsVertical } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UsersProfileImg from "./UsersProfileImg";
import { getDatabase, onValue, push, ref } from "firebase/database";

const UserList = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const [userList, setUserList] = useState([]);
  const [friendRequest, setFriendRequest] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [searchUser, setSearchUser] = useState([]);

  useEffect(() => {
    const userRef = ref(db, 'users');
    onValue(userRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid !== item.key) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setUserList(list);
    });
  }, [db, data.uid]);

  useEffect(() => {
    const friendRequestRef = ref(db, 'friendRequest');
    onValue(friendRequestRef, (snapshot) => {
      let request = [];
      snapshot.forEach((item) => {
        request.push(item.val().reciverId + item.val().senderId);
      });
      setFriendRequest(request);
    });
  }, [db]);

  useEffect(() => {
    const friendListRef = ref(db, 'friend');
    onValue(friendListRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        list.push(item.val().reciverId + item.val().senderId);
      });
      setFriendList(list);
    });
  }, [db]);

  const handleSearch = (e) => {
    let array = [];
    userList.filter((item) => {
      if (item.username.toLowerCase().includes(e.target.value.toLowerCase())) {
        array.push(item);
      }
      return null;
    });
    setSearchUser(array);
  };

  const handleFriendRequest = (item) => {
    push(ref(db, 'friendRequest'), {
      senderId: data.uid,
      senderName: data.displayName,
      reciverId: item.id,
      reciverName: item.username,
    });
  };

  return (
    <div className="list">
      <div className="title z-50 flex justify-between items-center">
        <h2>User List</h2>
        <div className="flex justify-between">
          <input onChange={handleSearch} type="text" placeholder="Search" className="border-2 border-primary outline-none rounded-lg px-2 w-full sm:w-[150px] mb-2 md:mb-0" />
          <BsThreeDotsVertical />
        </div>
      </div>
      {searchUser.length > 0 ? (
        searchUser.map((item, i) => (
          <div key={i} className="user-item mb-4 md:mb-2">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
              <div className="flex gap-3 items-center">
                <div className="h-12 w-12 md:h-[60px] md:w-[60px] bg-primary rounded-full overflow-hidden">
                  <UsersProfileImg imgId={item?.id}></UsersProfileImg>
                </div>
                <div>
                  <h2 className="font-bold text-base mb-0 pb-0 capitalize">{item?.username}</h2>
                  <h2 className="text-sm font-medium">{item?.email}</h2>
                </div>
              </div>
              <div className="mt-2 md:mt-0 flex items-center">
                {friendList.includes(item.id + data.uid) || friendList.includes(data.uid + item.id) ? (
                  <button className="btn_v_3">Friend</button>
                ) : friendRequest.includes(item.id + data.uid) || friendRequest.includes(data.uid + item.id) ? (
                  <button className="btn_v_3 bg-yellow-500 text-white">Pending</button>
                ) : (
                  <button onClick={() => handleFriendRequest(item)} className="btn_v_3 bg-green-500 text-white px-3 py-1">Add Friend</button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        userList.map((item, i) => (
          <div key={i} className="user-item mb-4 md:mb-2">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
              <div className="flex gap-3 items-center">
                <div className="h-12 w-12 md:h-[60px] md:w-[60px] bg-primary rounded-full overflow-hidden">
                  <UsersProfileImg imgId={item.id}></UsersProfileImg>
                </div>
                <div>
                  <h2 className="font-bold text-base mb-0 pb-0 capitalize">{item.username}</h2>
                  <h2 className="text-sm font-medium">{item.email}</h2>
                </div>
              </div>
              <div className="mt-2 md:mt-0 flex items-center">
                {friendList.includes(item.id + data.uid) || friendList.includes(data.uid + item.id) ? (
                  <button className="btn_v_3">Friend</button>
                ) : friendRequest.includes(item.id + data.uid) || friendRequest.includes(data.uid + item.id) ? (
                  <button className="btn_v_3 bg-yellow-500 text-white">Pending</button>
                ) : (
                  <button onClick={() => handleFriendRequest(item)} className="btn_v_3 bg-green-500 text-white px-3 py-1">Request</button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserList;
