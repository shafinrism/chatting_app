import Chatting from "../../components/Chatting";
import Friends from "../../components/Friends";
import MsgGroup from "../../components/MsgGroup";
import Navbar from "../../components/Navbar";


const Chat = () => {
  return (
    <div>
      <Navbar></Navbar>
      <div className="container mx-auto flex justify-between">
        <div className="w-[32.5%]">
          <div className="item ">
            <Friends></Friends>
          </div>
          <div className="item ">
          <MsgGroup></MsgGroup>
          </div>
        </div>
        <div className="w-[60%]">
          <Chatting></Chatting>
        </div>
      </div>
    </div>
  );
};

export default Chat;
