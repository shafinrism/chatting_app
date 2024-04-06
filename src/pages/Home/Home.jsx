
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { BsThreeDotsVertical } from "react-icons/bs";
import GroupList from "../../components/GroupList";
import UserList from "../../components/UserList";
import Friends from "../../components/Friends";
import FriendRequest from "../../components/FriendRequest";
import MyGroups from "../../components/MyGroups";
import BlockList from "../../components/BlockList";


const Home = () => {
  const data = useSelector((state) => state.userLoginInfo.userInfo)
  const navigate = useNavigate()
  useEffect(()=>{
    if(!data){
      navigate("/login")
    }
  })
  return (
    <div>
      <Navbar></Navbar>
      <div className="main_content">

        <div className="item">
          <Friends></Friends>
          
        </div>
          
        <div className="item">
          <GroupList></GroupList>
        </div>

          
        <div className="item">
          <UserList></UserList>
         
        </div>
          
        <div className="item">
          <FriendRequest></FriendRequest>
          
        </div>
          
        <div className="item">
          
          <MyGroups></MyGroups>
        </div>
          
        <div className="item">
          
          <BlockList></BlockList>
        </div>
          

      </div>
    </div>
  );
};

export default Home;