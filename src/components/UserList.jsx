import { BsThreeDotsVertical } from "react-icons/bs";
import {  getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UsersProfileImg from "./UsersProfileImg";





const UserList = () => {
  const db = getDatabase()
  const data = useSelector((state)=>state.userLoginInfo.userInfo)
  let [userList, setUserList] = useState([])
  let [friendRequest,setFriendRequest] = useState([])
  let [friendList,setFriendList] = useState([])
  let [searchUser, setSearchUser] = useState([])

  // get userlist from users collection start
  useEffect(()=>{
    const userRef = ref(db,'users')
    onValue(userRef,(snapshot)=>{
      let list = []
      snapshot.forEach((item)=>{
        
        if(data.uid !== item.key){
          list.push({...item.val(),id: item.key})
        }
        
      })
      setUserList (list)
      
    })
    
  },[])
  // get userlist from users collection end

  // friend request send start

  const handleFriendRequest = (item)=>{
    set(push(ref(db, 'friendRequest')), {
      senderId: data.uid,
      senderName:data.displayName,
      reciverId:item.id,
      reciverName:item.username,
    })
  }
  useEffect(()=>{
    const friendRequestRef = ref(db,'friendRequest')
    onValue(friendRequestRef,(snapshot)=>{
      let request = []
      snapshot.forEach((item)=>{
        request.push(item.val().reciverId + item.val().senderId)
      })
      setFriendRequest(request)
      
    })
  },[])

  // friend list data from friend collection start
  useEffect(()=>{
    const friendListRef = ref(db,'friend')
    onValue(friendListRef,(snapshot)=>{
      let list = []
      snapshot.forEach((item)=>{
        list.push(item.val().reciverId + item.val().senderId)
      })
      setFriendList(list)
    })
  },[])
  // friend list data from friend collection end
  
  // friend request send end

  // search start
  const handleSearch = (e)=>{
    let array = []
    userList.filter((item)=>{
      if (item.username.toLowerCase().includes(e.target.value.toLowerCase())) {
        array.push(item)
      }
    })
    setSearchUser(array)
  }
  console.log(searchUser);
  // search end
  
  return (
    <div className="list">
        <div className="title">
            <h2>User List</h2>
            <input onChange={handleSearch} type="text" placeholder="Search" className="border-2 border-primary outline-none rounded-lg px-2 w-[250px]" />
            <BsThreeDotsVertical />
        </div>
        {
          searchUser.length>0 
          ?
          searchUser.map((item,i)=>{
          
            return(
              <div key={i}>
                <div  className="mb-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                <div className="h-[60px] w-[60px] bg-primary rounded-full overflow-hidden">
                  {/* <img className="w-full" src={item.photoURL} alt="" /> */}
                  <UsersProfileImg imgId={item.id}></UsersProfileImg>
                </div>
                <div>
                  <h2 className="font-bold text-base mb-0 pb-0 capitalize">{item.username}</h2>
                  <h2 className="text-sm  font-medium">{item.email}</h2>
                </div>
                </div>
  
                <div>
                  {
                    friendList.includes(item.id + data.uid) || friendList.includes(data.uid + item.id) ?
                    <button  className="btn_v_3">Friend</button>
                    :
                    friendRequest.includes(item.id + data.uid) || friendRequest.includes(data.uid + item.id) ?
                    <button  className="btn_v_3">Pending........</button>
                    :
                    <button onClick={()=>handleFriendRequest(item)} className="btn_v_3">Add Friend</button>
                  }
                  
                </div>
  
              </div>
            </div>
              </div>
            )
  
          })
          :
          userList.map((item,i)=>{
          
            return(
              <div key={i}>
                <div  className="mb-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                <div className="h-[60px] w-[60px] bg-primary rounded-full overflow-hidden">
                  {/* <img className="w-full" src={item.photoURL} alt="" /> */}
                  <UsersProfileImg imgId={item.id}></UsersProfileImg>
                </div>
                <div>
                  <h2 className="font-bold text-base mb-0 pb-0 capitalize">{item.username}</h2>
                  <h2 className="text-sm  font-medium">{item.email}</h2>
                </div>
                </div>
  
                <div>
                  {
                    friendList.includes(item.id + data.uid) || friendList.includes(data.uid + item.id) ?
                    <button  className="btn_v_3">Friend</button>
                    :
                    friendRequest.includes(item.id + data.uid) || friendRequest.includes(data.uid + item.id) ?
                    <button  className="btn_v_3">Pending........</button>
                    :
                    <button onClick={()=>handleFriendRequest(item)} className="btn_v_3">Add Friend</button>
                  }
                  
                </div>
  
              </div>
            </div>
              </div>
            )
  
          })
        }

      {
        
      }
         
    </div>
  );
};

export default UserList;