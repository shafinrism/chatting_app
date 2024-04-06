import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import UsersProfileImg from "./UsersProfileImg";




const FriendRequest = () => {

  const db = getDatabase()
  const data = useSelector((state)=>state.userLoginInfo.userInfo)
  let [friendRequestList,setFriendRequestList] = useState([])
  


// get friend request list from friend request collection start
  useEffect(()=>{
    const friendRequestRef = ref(db,'friendRequest')
    onValue(friendRequestRef,(snapshot)=>{
      let list = []
      snapshot.forEach((item)=>{
        if(item.val().reciverId===data.uid){
          list.push({...item.val(),id: item.key})
        }
      })
      setFriendRequestList(list)
    })
  },[])


  // get friend request list from friend request collection end

  // friend request accept start
  const handleFriendRequestAccept = (item) => {
    set(push(ref(db,'friend')),{
      ...item
    })
    .then(()=>{
      remove(ref(db,'friendRequest/' + item.id))
    })
  }
  // friend request accept end
  // friend request cancel start
  const handleFriendRequestCancel = (item)=>{
    remove(ref(db,'friendRequest/' + item.id))
  }
  // friend request cancel end
  return (
    <div className="list">
        <div className="title">
            <h2>Friend Request</h2>
            <BsThreeDotsVertical />
        </div>

      <div>
        {
          friendRequestList.map((item)=>{
            return(
              <div key={item.id}>
                <div  className="mb-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                <div className="h-[60px] w-[60px] bg-primary rounded-full overflow-hidden">
                  <UsersProfileImg imgId={item.senderId}></UsersProfileImg>
                </div>
                <div>
                  <h2 className="font-bold text-base mb-0 pb-0 capitalize">{item.senderName}</h2>
                  
                </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>handleFriendRequestAccept(item)} className="btn_v_3">Accept</button>
                  <button onClick={()=>handleFriendRequestCancel(item)} className="btn_v_4">Cancel</button>
                </div>
              </div>
            </div> 
              </div>
            )
          })
        }

      </div> 
    </div>
  );
};

export default FriendRequest;