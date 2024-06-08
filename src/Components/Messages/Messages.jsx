import React from 'react';
import { Send } from 'lucide-react';
const Messages = ({pc, messages,callId ,socket,message,setMessage}) => {
  console.log(pc?.connectionState)
    return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900 text-black flex flex-col justify-start items-center dark:text-white">
      <div className="container flex flex-col justify-start items-center  mx-auto p-4">
        {callId||pc?.connectionState=='connected'?.length ? (
          messages.map((message, index) => (
            <article
              className="flex flex- sm:flex-row items-center p-4 mb-4 rounded-lg shadow-md transition-colors min-w-[250px] w-full duration-200 bg-gray-50 dark:bg-gray-800"
              key={index}
            >
              <img
                className="w-16 h-16 rounded-full mr-4"
                src={message.studentImage}
                alt={message.studentName}
              />
              <div className="flex flex-col justify-center items-start">
                <h2 className="font-semibold">{message.studentName}</h2>
                <p className="mt-2">{message.content}</p>
              </div>

            </article>
          ))
        ) : (
          <p>No messages to display.</p>
        )}
             {JSON.parse(localStorage.getItem('user')).role=='student'? <form
                id="message form"
                className="opacity-[0.3] bg-black rounded-lg p-1 flex flex-row  items-center dark:bg-white fixed bottom-6 left-1/2 -translate-x-1/2"
              >
                <input
                  onChange={(e) =>
                    setMessage((pre) => ({ ...pre, content: e.target.value }))
                  }
                  value={message.content}
                  className="p-1 dark:bg-white  bg-black focus-visible:border-none dark:text-black text-white"
                  type="text"
                  name="message"
                  id="message"
                />
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    socket.emit("message", { message, callId });
                    console.log("message emmited", message, callId);
                    setMessage(pre=>({...pre,content:''}))
                  }}
                >
                  <Send fill="white" size={30} stroke="black" />
                </button>
              </form>:null}
            
      </div>
    
    </div>
  );
};

export default Messages;
