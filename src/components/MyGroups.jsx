import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import UsersProfileImg from "./UsersProfileImg";

const MyGroups = () => {
  const [groupList, setGroupList] = useState([]);
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const [showRequest, setShowRequest] = useState(false);
  const [groupJoinRequest, setGroupJoinRequest] = useState([]);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid === item.val().adminId) {
          list.push({ ...item.val(), key: item.key });
        }
      });
      setGroupList(list);
    });
  }, []);

  const handleGroupDelete = (item) => {
    remove(ref(db, "group/" + item.key));
  };

  const handleGroupRequest = (group) => {
    setShowRequest(!showRequest);
    const groupRequestRef = ref(db, "joinGroupRequest");
    onValue(groupRequestRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid === item.val().adminId && item.val().groupId === group.key) {
          list.push({ ...item.val(), key: item.key });
        }
      });
      setGroupJoinRequest(list);
    });
  };
  
  const handleRequestAccept = (item) => {
    set(push(ref(db, "groupMembers")), {
      groupId: item.groupId,
      groupName: item.groupName,
      adminId: item.adminId,
      adminName: item.adminName,
      userId: item.userId,
      userName: item.userName,
    }).then(() => {
      remove(ref(db, "joinGroupRequest/" + item.key));
    });
  };

  const handleGroupRequestCancel = (item) => {
    remove(ref(db, "joinGroupRequest/" + item.key));
  };

  const handleGroupInfo = (itemInfo) => {
    setShowGroupInfo(!showGroupInfo);
    const groupMemberRef = ref(db, "groupMembers");
    onValue(groupMemberRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid === itemInfo.adminId && item.val().groupId === itemInfo.key) {
          list.push({ ...item.val(), key: item.key });
        }
      });
      setGroupMembers(list);
    });
  };

  const handleGroupMembersCancel = (item) => {
    remove(ref(db, "groupMembers/" + item.key));
  };

  return (
    <div className="list">
      <div className="title z-50">
        <h2>My Group</h2>
        <BsThreeDotsVertical />
      </div>
      {groupList.length === 0 ? (
        <h1 className="text-center font-bold text-2xl text-secondary">No Group Available</h1>
      ) : showRequest ? (
        <div className="bg-primary rounded-lg py-10 px-6 relative z-0">
          <button onClick={() => setShowRequest(!showRequest)} className="border-b-2 border-secondary font-bold absolute w-auto right-2 top-2 text-secondary">X</button>
          {groupJoinRequest.map((item, i) => (
            <div key={i} className="mb-2 bg-white rounded-lg ">
              <div className="flex justify-between items-center p-2">
                <div className="flex gap-2 items-center h-auto">
                  <div className="h-[50px] w-[50px]  bg-secondary rounded-full  flex justify-center items-center overflow-hidden">
                    <UsersProfileImg imgId={item.userId}></UsersProfileImg>
                  </div>
                  <div>
                    <h2 className="font-bold text-base mb-0 pb-0 capitalize">{item.userName}</h2>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleRequestAccept(item)} className="btn_v_6 ">Accept</button>
                  <button onClick={() => handleGroupRequestCancel(item)} className="btn_v_4 rounded-3xl">Cancel</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : showGroupInfo ? (
        <div className="bg-primary rounded-lg py-10 px-6 relative z-0">
          <button onClick={() => setShowGroupInfo(!showGroupInfo)} className="border-b-2 border-secondary font-bold absolute w-auto right-2 top-2 text-secondary">X</button>
          {groupMembers.map((item, i) => (
            <div key={i} className="mb-2 bg-white rounded-lg ">
              <div className="flex justify-between items-center p-2">
                <div className="flex gap-2 items-center h-auto">
                  <div className="h-[50px] w-[50px]  bg-secondary rounded-full  flex justify-center items-center overflow-hidden">
                    <UsersProfileImg imgId={item.userId}></UsersProfileImg>
                  </div>
                  <div>
                    <h2 className="font-bold text-base mb-0 pb-0 capitalize">{item.userName}</h2>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleGroupMembersCancel(item)} className="btn_v_4 rounded-3xl">Cancel</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        groupList.map((item, i) => (
          <div key={i} className="mb-2">
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center h-auto">
                <div className="h-[60px] w-[60px]  bg-primary rounded-full  flex justify-center items-center overflow-hidden">
                  <h2 className="font-bold uppercase text-md ">{item.groupName[0]}</h2>
                </div>
                <div>
                  <h2 className="font-bold text-base mb-0 pb-0 capitalize">{item.groupName}</h2>
                  <h2 className="text-sm  font-medium">{item.groupIntro}</h2>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleGroupRequest(item)} className="btn_v_3">Request</button>
                <button onClick={() => handleGroupDelete(item)} className="btn_v_4">Delete</button>
                <button onClick={() => handleGroupInfo(item)} className="btn_v_3">Info</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyGroups;
