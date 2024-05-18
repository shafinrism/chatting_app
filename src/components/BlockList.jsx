import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import UsersProfileImg from "./UsersProfileImg";

const BlockList = () => {
  const [blockList, setBlockList] = useState([]);
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);

  useEffect(() => {
    const blockRef = ref(db, "Block");
    onValue(blockRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid == item.val().blockById) {
          list.push({
            id: item.key,
            block: item.val().block,
            blockId: item.val().blockId,
          });
        } else {
          list.push({
            id: item.key,
            blockedBy: item.val().blockedBy,
            blockById: item.val().blockById,
          });
        }
      });
      setBlockList(list);
    });
  }, []);

  // handle unblock start
  const handleUnblock = (item) => {
    set(push(ref(db, "friend")), {
      senderId: item.blockId,
      senderName: item.block,
      reciverId: data.uid,
      reciverName: data.displayName,
    }).then(() => {
      remove(ref(db, "Block/" + item.id));
    });
  };
  // handle unblock end

  return (
    <div className="list">
      <div className="title flex justify-between items-center">
        <h2 className="text-lg font-bold">Block List</h2>
        <BsThreeDotsVertical className="text-xl" />
      </div>

      {blockList.map((item, i) => {
        return (
          <div key={i} className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 bg-primary rounded-full overflow-hidden">
                {item.blockById ? (
                  <UsersProfileImg imgId={item.blockById}></UsersProfileImg>
                ) : (
                  <UsersProfileImg imgId={item.blockId}></UsersProfileImg>
                )}
              </div>
              <div>
                <h2 className="text-base font-bold mb-0">{item.block ? item.block : item.blockedBy}</h2>
              </div>
            </div>
            <div>
              {item.blockById ? (
                <button className="btn_v_3">Blocked By {item.blockedBy}</button>
              ) : (
                <button onClick={() => handleUnblock(item)} className="btn_v_5">Unblock</button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlockList;
