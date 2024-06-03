import React, { useState, useEffect, useRef } from "react";
import { socket } from "../App.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
const user = JSON.parse(localStorage.getItem("user"));
let pc;
const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};
let localStream;
async function getOfferCreatePcAndSendAnswer(offer) {
  if (pc) {
    console.log("call is already on going");
    return;
  }
  try {
    pc = new RTCPeerConnection(configuration);
    pc.onicecandidate = (e) => {
      console.log("found ice");
      if (e.candidate)
        socket.emit("student-sent-candidate", {
          callId,
          studentId,
          candidate: e.candidate,
        });
    };
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    const answer = await pc.createAnswer();
    socket.emit("student-sent-answer", {
      callId,
      studentId: user.id,
      answer,
    });
    await pc.setLocalDescription(answer);
  } catch (error) {}
}
async function startTheCall(
  teacherVideo,
  callStartedFlag,
  setCallStartedFlag,
  courseId,
  callId,
  setCallId
) {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: { echoCancellation: true },
    });
    teacherVideo.current.srcObject = localStream;

    console.log(configuration);
    pc = new RTCPeerConnection(configuration);
    pc.onicecandidate = (e) => {
      console.log("found ice");
      if (e.candidate)
        socket.emit("teacher-candidate", {
          callId,
          candidate: e.candidate,
        });
    };
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    const offer = await pc.createOffer();
    socket.emit("teacher-offer", {
      callId,
      offer,
    });
    await pc.setLocalDescription(offer);
  } catch (err) {
    console.log(err);
  }
}
function haltTheCall(localStream) {
  console.log(localStream);
  localStream.getTracks().forEach((track) => track.stop());
  localStream = null;
}
function mute(videoRef, mutedFlag, setMutedFlag) {
  console.log(videoRef);
  console.log(mutedFlag);
  if (!mutedFlag) {
    videoRef.current.muted = true;
    setMutedFlag(true);
  } else {
    videoRef.current.muted = false;
    setMutedFlag(false);
  }
}
async function turnOnStudentVideo(studentVideoRef) {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    studentVideoRef.current.srcObject = localStream;
  } catch (error) {
    console.log("student has refused to to give permission");
  }
}
const Room = () => {
  const { courseId } = useParams();

  const [call, setCall] = useState({});
  const [callId, setCallId] = useState(null);
  const [callStartedFlag, setCallStartedFlag] = useState(false);
  const [callHaltedFlag, setCallHaltedFlag] = useState(false);
  const [mutedFlag, setMutedFlag] = useState(false);
  const teacherVideo = useRef("");
  const studentVideo = useRef("");

  useEffect(() => {
    async function createCall() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user.role != "teacher") return;
      const { data } = await axios.post(
        "http://127.0.0.1:3000/api/teacher/create_lesson",
        {
          teacherId: user.id,
          courseId,
        },
        {
          headers: {
            email: user.email,
            password: user.password,
          },
        }
      );
      setCallId(data._id);
    }
    async function getTheCall() {
      const { data } = await axios.get(
        `http://127.0.0.1:3000/api/student/request_call?courseId=${courseId}`,
        {
          headers: {
            email: user.email,
            password: user.password,
          },
        }
      );
      if (!data?._id) throw new Error("no call is being made");

      setCall(data);

      return data;
    }

    if (user.role == "student") {
      // if there is data this means that the teachers offer is ready
      getTheCall()
        .then((call) => {
          turnOnStudentVideo(studentVideo);

          getOfferCreatePcAndSendAnswer(call.offer);
        })
        .catch((err) => {
          console.log(err);
        });
      socket.on("get-teacher-candidate", async ({ candidate }) => {});
    }
    if (user.role == "teacher") createCall();
  }, []);
  return (
    <section
      id="room "
      className="relative w-full  flex flex-col  items-center "
    >
      <div className="relative">
        <video
          ref={teacherVideo}
          className="bg-black max-h-[50vh] mt-[100px] relative w-screen shadow-xl max-w-[1000px] min-w-[340px]"
          autoPlay
          playsInline
          src=" "
        ></video>
        <div className="flex mt-3 flex-row justify-evenly items-center">
          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              startTheCall(
                teacherVideo,
                callStartedFlag,
                setCallStartedFlag,
                courseId,
                callId,
                setCallId
              );
            }}
            className=" bg-white text-black"
          >
            start call
          </button>
          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              mute(teacherVideo, mutedFlag, setMutedFlag);
            }}
            className="  bg-white text-black"
          >
            mute
          </button>
          {/* <button
        onClick={async(e)=>{
            e.preventDefault()
            e.stopPropagation()
            haltTheCall(localStream)
        }}  
        className='  bg-white text-black' >
            halt call
        </button> */}
        </div>
        <video
          src=""
          playsInline
          autoPlay
          ref={studentVideo}
          className="bg-black w-[150px] aspect-square absolute left-5"
        >
          cxz
        </video>
      </div>
    </section>
  );
};

export default Room;
// import { io } from "socket.io-client";
// import { useRef, useEffect, useState } from "react";
// import { FiVideo, FiVideoOff, FiMic, FiMicOff } from "react-icons/fi";
// const configuration = {
//   iceServers: [
//     {
//       urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
//     },
//   ],
//   iceCandidatePoolSize: 10,
// };
// const socket = io("http://localhost:3000", { transports: ["websocket"] });

// let pc;
// let localStream;
// let startButton;
// let hangupButton;
// let muteAudButton;
// let remoteVideo;
// let teacherVideo;
// socket.on("message", (e) => {
//   if (!localStream) {
//     console.log("not ready yet");
//     return;
//   }
//   switch (e.type) {
//     case "offer":
//       handleOffer(e);
//       break;
//     case "answer":
//       handleAnswer(e);
//       break;
//     case "candidate":
//       handleCandidate(e);
//       break;
//     case "ready":
//       // A second tab joined. This tab will initiate a call unless in a call already.
//       if (pc) {
//         console.log("already in call, ignoring");
//         return;
//       }
//       makeCall();
//       break;
//     case "bye":
//       if (pc) {
//         hangup();
//       }
//       break;
//     default:
//       console.log("unhandled", e);
//       break;
//   }
// });

// async function makeCall() {

//   try {
//     pc = new RTCPeerConnection(configuration);
//     pc.onicecandidate = (e) => {
//       const message = {
//         type: "candidate",
//         candidate: null,
//       };
//       if (e.candidate) {
//         message.candidate = e.candidate.candidate;
//         message.sdpMid = e.candidate.sdpMid;
//         message.sdpMLineIndex = e.candidate.sdpMLineIndex;
//       }
//       socket.emit("message", message);
//     };
//     pc.ontrack = (e) => (remoteVideo.current.srcObject = e.streams[0]);
//     localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
//     const offer = await pc.createOffer();
//     socket.emit("message", { type: "offer", sdp: offer.sdp });
//     await pc.setLocalDescription(offer);
//   } catch (e) {
//     console.log(e);
//   }
// }

// async function handleOffer(offer) {
//   if (pc) {
//     console.error("existing peerconnection");
//     return;
//   }
//   try {
//     pc = new RTCPeerConnection(configuration);
//     pc.onicecandidate = (e) => {
//       const message = {
//         type: "candidate",
//         candidate: null,
//       };
//       if (e.candidate) {
//         message.candidate = e.candidate.candidate;
//         message.sdpMid = e.candidate.sdpMid;
//         message.sdpMLineIndex = e.candidate.sdpMLineIndex;
//       }
//       socket.emit("message", message);
//     };
//     pc.ontrack = (e) => (remoteVideo.current.srcObject = e.streams[0]);
//     localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
//     await pc.setRemoteDescription(offer);

//     const answer = await pc.createAnswer();
//     socket.emit("message", { type: "answer", sdp: answer.sdp });
//     await pc.setLocalDescription(answer);
//   } catch (e) {
//     console.log(e);
//   }
// }

// async function handleAnswer(answer) {
//   if (!pc) {
//     console.error("no peerconnection");
//     return;
//   }
//   try {
//     await pc.setRemoteDescription(answer);
//   } catch (e) {
//     console.log(e);
//   }
// }

// async function handleCandidate(candidate) {
//   try {
//     if (!pc) {
//       console.error("no peerconnection");
//       return;
//     }
//     if (!candidate) {
//       await pc.addIceCandidate(null);
//     } else {
//       await pc.addIceCandidate(candidate);
//     }
//   } catch (e) {
//     console.log(e);
//   }
// }
// async function hangup() {
//   if (pc) {
//     pc.close();
//     pc = null;
//   }
//   localStream.getTracks().forEach((track) => track.stop());
//   localStream = null;
//   startButton.current.disabled = false;
//   hangupButton.current.disabled = true;
//   muteAudButton.current.disabled = true;
// }

// function App() {
//   startButton = useRef(null);
//   hangupButton = useRef(null);
//   muteAudButton = useRef(null);
//   teacherVideo = useRef(null);
//   remoteVideo = useRef(null);
//   useEffect(() => {
//     hangupButton.current.disabled = true;
//     muteAudButton.current.disabled = true;
//   }, []);
//   const [audiostate, setAudio] = useState(false);

//   const startB = async () => {
//     try {
//       localStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: { echoCancellation: true },
//       });
//       teacherVideo.current.srcObject = localStream;
//     } catch (err) {
//       console.log(err);
//     }

//     startButton.current.disabled = true;
//     hangupButton.current.disabled = false;
//     muteAudButton.current.disabled = false;

//     socket.emit("message", { type: "ready" });
//   };

//   const hangB = async () => {
//     hangup();
//     socket.emit("message", { type: "bye" });
//   };

//   function muteAudio() {
//     if (audiostate) {
//       teacherVideo.current.muted = true;
//       setAudio(false);
//     } else {
//       teacherVideo.current.muted = false;
//       setAudio(true);
//     }
//   }
//   return (
//     <>
//       <main className="container  ">
//         <div className="video bg-main">
//           <video
//             ref={teacherVideo}
//             className="video-item"
//             autoPlay
//             playsInline
//             src=" "
//           ></video>
//           <video
//             ref={remoteVideo}
//             className="video-item"
//             autoPlay
//             playsInline
//             src=" "
//           ></video>
//         </div>

//         <div className="btn">
//           <button
//             className="btn-item btn-start"
//             ref={startButton}
//             onClick={startB}
//           >
//             <FiVideo />
//           </button>
//           <button
//             className="btn-item btn-end"
//             ref={hangupButton}
//             onClick={hangB}
//           >
//             <FiVideoOff />
//           </button>
//           <button
//             className="btn-item btn-start"
//             ref={muteAudButton}
//             onClick={muteAudio}
//           >
//             {audiostate ? <FiMic /> : <FiMicOff />}
//           </button>
//         </div>
//       </main>
//     </>
//   );
// }

// export default App
