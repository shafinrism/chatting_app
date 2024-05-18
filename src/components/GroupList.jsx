import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";

const GroupList = () => {
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const db = getDatabase();
  const [show, setShow] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupIntro, setGroupIntro] = useState("");
  const [groupNameError, setGroupNameError] = useState("");
  const [groupIntroError, setGroupIntroError] = useState("");
  const [groupList, setGroupList] = useState([]);

  const handleGroupName = (e) => {
    setGroupName(e.target.value);
    setGroupNameError("");
  };

  const handleGroupIntro = (e) => {
    setGroupIntro(e.target.value);
    setGroupIntroError("");
  };

  const handleCreateGroup = () => {
    if (groupName === "") {
      setGroupNameError("Group name is required");
    } else if (groupName.length > 8) {
      setGroupNameError("Group name should be maximum 8 characters");
    } else if (groupIntro === "") {
      setGroupIntroError("Group intro is required");
    } else {
      set(push(ref(db, "group")), {
        groupName: groupName,
        groupIntro: groupIntro,
        adminName: data.displayName,
        adminId: data.uid,
      }).then(() => {
        toast.success("Group Created");
        setGroupName("");
        setGroupIntro("");
        setShow(false);
      });
    }
  };

  useEffect(() => {
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid !== item.val().adminId) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setGroupList(list);
    });
  }, []);

  const handleJoinGroup = (item) => {
    set(push(ref(db, "joinGroupRequest")), {
      groupId: item.id,
      groupName: item.groupName,
      groupIntro: item.groupIntro,
      adminId: item.adminId,
      adminName: item.adminName,
      userId: data.uid,
      userName: data.displayName,
    }).then(() => {
      toast.success("Request Sent");
    });
  };

  return (
    <div className="list">
      <div className="title flex justify-between items-center">
        <h2>Group List</h2>
        <button onClick={() => setShow(!show)} className="btn_v_6">{show ? "Cancel" : "Create Group"}</button>
      </div>
      {show ? (
        <div className="bg-primary p-4 rounded-3xl">
          <input onChange={handleGroupName} type="text" placeholder="Group Name" className="w-full py-2 px-4 rounded-3xl mb-2 outline-none" />
          <p className="text-red-500 font-medium mb-1">{groupNameError}</p>
          <input onChange={handleGroupIntro} type="text" placeholder="Group Intro" className="w-full py-2 px-4 rounded-3xl mb-2 outline-none" />
          <p className="text-red-500 font-medium mb-1">{groupIntroError}</p>
          <button onClick={handleCreateGroup} className="w-full btn_v_6">Create</button>
        </div>
      ) : (
        <div>
          {groupList.map((item, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="h-16 w-16 bg-primary rounded-full overflow-hidden flex justify-center items-center">
                    <h2 className="font-bold uppercase text-xl">{item.groupName[0]}</h2>
                  </div>
                  <div>
                    <h2 className="font-bold text-sm mb-0 pb-0 uppercase">{item.groupName}</h2>
                    <h2 className="text-sm font-medium">{item.groupIntro}</h2>
                  </div>
                </div>
                <div>
                  <button onClick={() => handleJoinGroup(item)} className="btn_v_3">Join</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupList;
