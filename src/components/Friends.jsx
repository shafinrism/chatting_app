import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import UsersProfileImg from "./UsersProfileImg";
import { activeChat } from "../slices/activeChatSlice";

const Friends = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const [friendList, setFriendList] = useState([]);
  const dispatch = useDispatch();

  // get friend from friend collections start
  useEffect(() => {
    const friendRef = ref(db, 'friend');
    onValue(friendRef, (snapshot) => {
      const list = [];
      snapshot.forEach((item) => {
        if (data.uid === item.val().reciverId || data.uid === item.val().senderId) {
          list.push({ ...item.val(), key: item.key });
        }
      });
      setFriendList(list);
    });
  }, []);
  // get friend from friend collections end

  // block start
  const handleBlock = (item) => {
    console.log(item);
    if (data.uid === item.senderId) {
      set(push(ref(db, 'Block')), {
        block: item.reciverName,
        blockId: item.reciverId,
        blockedBy: item.senderName,
        blockById: item.senderId,
      }).then(() => {
        remove(ref(db, 'friend/' + item.key));
      });
    } else {
      set(push(ref(db, 'Block')), {
        block: item.senderName,
        blockId: item.senderId,
        blockedBy: item.reciverName,
        blockById: item.reciverId,
      }).then(() => {
        remove(ref(db, 'friend/' + item.key));
      });
    }
  };
  // block end

  // active friend start
  const handleActiveFriend = (item) => {
    if (item.reciverId === data.uid) {
      dispatch(activeChat({ status: "single", id: item.senderId, name: item.senderName }));
      localStorage.setItem("activeFriend", JSON.stringify({ status: "single", id: item.senderId, name: item.senderName }));
    } else {
      dispatch(activeChat({ status: "single", id: item.reciverId, name: item.reciverName }));
      localStorage.setItem("activeFriend", JSON.stringify({ status: "single", id: item.reciverId, name: item.reciverName }));
    }
  };
  // active friend end

  return (
    <div className="list">
      <div className="title flex justify-between items-center">
        <h2 className="text-lg font-bold">Friends</h2>
        <BsThreeDotsVertical className="text-xl" />
      </div>

      {friendList.map((item) => (
        <div key={item.key} className="mb-2">
          <div className="flex justify-between items-center">
            <div onClick={() => handleActiveFriend(item)} className="cursor-pointer flex gap-3 items-center">
              <div className="h-16 w-16 bg-primary rounded-full overflow-hidden">
                <UsersProfileImg imgId={data.uid === item.senderId ? item.reciverId : item.senderId}></UsersProfileImg>
              </div>
              <div>
                <h2 className="font-bold text-base mb-0 pb-0 capitalize">{data.uid === item.senderId ? item.reciverName : item.senderName}</h2>
                <h2 className="text-sm font-medium">Hello..</h2>
              </div>
            </div>
            <div className="flex gap-2">
              
              <button onClick={() => handleBlock(item)} className="btn_v_4">Block</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Friends;
