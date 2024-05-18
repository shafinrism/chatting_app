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
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!data) {
      navigate("/login");
    }
  }, [data, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex justify-center items-start">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="item">
            <Friends />
          </div>

          <div className="item">
            <GroupList />
          </div>

          <div className="item">
            <UserList />
          </div>

          <div className="item">
            <FriendRequest />
          </div>

          <div className="item">
            <MyGroups />
          </div>

          <div className="item">
            <BlockList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
