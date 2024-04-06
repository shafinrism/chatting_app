import { getDatabase, onValue, push, ref, set } from "firebase/database";
import {  useEffect, useState } from "react";
import {  toast } from 'react-toastify';
import { useSelector } from "react-redux";

const MsgGroup = () => {
  const data = useSelector((state)=>state.userLoginInfo.userInfo)
  const db = getDatabase()
  
  // get input value
  const [groupName,setGroupName] = useState("")
  const [groupIntro,setGroupIntro] = useState("")
  const [groupNameError,setGroupNameError] = useState("")
  const [groupIntroError,setGroupIntroError] = useState("")
  const [groupList,setGroupList] = useState([])

  const handleGroupName = (e)=>{
    setGroupName(e.target.value)
    setGroupNameError("")
    
  }
  const handleGroupIntro = (e)=>{
    setGroupIntro(e.target.value)
    setGroupIntroError("")
  }
 

  

  // get group list start
  useEffect(()=>{
    const groupRef = ref(db,"group")
    onValue(groupRef, (snapshot)=>{
      let list = []
      snapshot.forEach((item)=>{
        list.push({...item.val(),id: item.key})
      })
      setGroupList(list)
    })
  },[])
  // get group list end

 
  
  return (
    <div className="list">
        <div className="title">
            <h2>Group List</h2>
        </div>

        <div>
            {
              groupList.map((item,i)=>{
                return(
                  <div key={i} className="mb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <div className="h-[60px] w-[60px] bg-primary rounded-full     overflow-hidden flex justify-center items-center">
                          <h2 className="font-bold uppercase text-xl">{item.groupName[0]}</h2>
                        </div>
                        <div>
                          <h2 className="font-bold text-sm mb-0 pb-0 uppercase">{item.groupName}</h2>
                          <h2 className="text-sm  font-medium">{item.groupIntro}</h2>
                        </div>
                      </div>
                      <div>
                        <button  className="btn_v_3">Message</button>
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

export default MsgGroup;