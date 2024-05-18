import ModalImage from "react-modal-image";
import { TfiGallery } from "react-icons/tfi";
import { BsEmojiLaughing } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { AiTwotoneAudio } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getDownloadURL, getStorage, uploadBytesResumable, ref as sref } from "firebase/storage";
import { getDatabase, onValue, push, ref, set } from "firebase/database";

const imgUrl = 'https://i.pinimg.com/736x/a5/e8/9d/a5e89dc19d0a7690253ccb52b6c85fc7.jpg';

const Chatting = () => {
  const storage = getStorage();
  const db = getDatabase();
  const activeChatName = useSelector((state) => state.activeChatSlice);
  console.log(activeChatName);
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  console.log(data);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);

  // handle Message start
  const handleMessageSend = () => {
    if (activeChatName.active.status === "single") {
      if (message.trim() !== "") {
        set(
          push(ref(db, "singleMessages")),
          {
            whoSendId: data.uid,
            whoSendName: data.displayName,
            whoReciveId: activeChatName.active.id,
            whoReciveName: activeChatName.active.name,
            msg: message,
            date: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()},${new Date().getHours() % 12 || 12}:${new Date().getMinutes()}  ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
          }
        ).then(() => {
          console.log("Message sent successfully");
          setMessage("");
        }).catch((error) => {
          console.log("Error sending message:", error);
        });
      } else {
        console.log("Empty message, not sending.");
      }
    } else {
      console.log("Group chat");
    }
  };

  useEffect(() => {
    onValue(ref(db, "singleMessages"), (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          (item.val().whoSendId == data.uid && item.val().whoReciveId == activeChatName.active.id) ||
          (item.val().whoReciveId == data.uid && item.val().whoSendId == activeChatName.active.id)
        ) {
          arr.push(item.val());
        }
      });
      setMessageList(arr);
    });
  }, [activeChatName.active?.id]);

  // handle Message end

  // handle img upload start
  const handleImgUpload = (e) => {
    const storageRef = sref(storage, e.target.files[0].name);

    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          set(
            push(ref(db, "singleMessages")),
            {
              whoSendId: data.uid,
              whoSendName: data.displayName,
              whoReciveId: activeChatName.active.id,
              whoReciveName: activeChatName.active.name,
              img: downloadURL,
              date: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()},${new Date().getHours() % 12 || 12}:${new Date().getMinutes()}  ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
            }
          );
        });
      }
    );
  }
  // handle img upload end

  useEffect(() => {
    // Update the disabled state based on the message length
    setIsDisabled(message.trim() === "");
  }, [message]);

  return (
    <div className="relative h-full overflow-y-scroll rounded-lg mt-5 border-2 border-white bg-[#121212] px-2">
      {/* identify start */}
      <div className="sticky top-0 right-0 flex items-center gap-5 bg-[#121212] border-b-2 border-gray-300 py-2 mb-3 z-50">
        <div className="h-[60px] w-[60px] overflow-hidden bg-primary rounded-full">
          <img src="" alt="" />
        </div>
        <div>
          <h2 className="text-base text-white font-bold capitalize">{activeChatName.active?.name}</h2>
          <p className="text-white">Online</p>
        </div>
      </div>
      {/* identify end */}

      <div>
        {activeChatName.active?.status === "single" ? (
          messageList.map((item, i) => (
            item.whoSendId == data.uid ? (
              item.msg ? (
                <div key={i} className="text-right my-4">
                  <div className="inline-block px-3 py-1 rounded-l-2xl bg-secondary">
                    <p className="text-left">{item.msg}</p>
                  </div>
                  <p className="text-gray-400 text-right">{item.date}</p>
                </div>
              ) : (
                <div className="text-right my-4">
                  <div className="inline-block p-1">
                    <ModalImage
                      className="h-[200px] rounded-xl"
                      small={item.img}
                      large={item.img}
                      alt="Hello World!"
                    />
                  </div>
                  <p className="text-gray-400 text-right">{item.date}</p>
                </div>
              )
            ) : (
              item.msg ? (
                <div key={i} className="text-left my-4">
                  <div className="inline-block px-3 py-1 rounded-r-2xl bg-gray-300">
                    <p>{item.msg}</p>
                  </div>
                  <p className="text-gray-400 text-left">{item.date}</p>
                </div>
              ) : (
                <div className="text-left">
                  <div className="inline-block p-1">
                    <ModalImage
                      className="h-[200px] rounded-xl"
                      small={item.img}
                      large={item.img}
                      alt="Hello World!"
                    />
                  </div>
                  <p className="text-gray-400 text-left">{item.date}</p>
                </div>
              )
            )
          ))
        ) : (
          <h1>Group</h1>
        )}
      </div>

      {/* ======================= */}
      <div className="w-full bg-[#121212] flex justify-between sticky bottom-0 border-gray-300 items-center gap-5 border-t-2 py-2">
        <div className="flex justify-between items-center w-full gap-5 rounded-full">
          <div className="w-full">
            <input
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              type="text"
              placeholder="Type a message"
              className="input border border-secondary outline-none w-full py-2 px-4 rounded-full shadow-slate-200"
            />
          </div>
          <div className="flex gap-3 items-center mr-5">
            <button>
              <BsEmojiLaughing className="text-2xl text-secondary" />
            </button>
            <button>
              <AiTwotoneAudio className="text-2xl text-secondary" />
            </button>
            <label>
              <input onChange={handleImgUpload} type="file" className="text-white hidden" />
              <TfiGallery className="text-2xl text-secondary" />
            </label>
          </div>
        </div>
        {!isDisabled && (
          <div className="flex items-center">
            <button
              onClick={handleMessageSend}
              className={`text-white text-3xl ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
              disabled={isDisabled}
            >
              <IoSendSharp />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatting;
