import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { socket } from "../App.jsx";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};
let peerConnections;
let teacherStream;
let studentStream;
let pc

const Room = () => {
  let teacherVideoRef = useRef();
  let studentVideoRef = useRef();
  const query = useQuery();
  const [callId, setCallId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (user.role == "student") {
      if (query.get("callOnGoing") == "yes") {
        // this means the candidate of the teacher is set
        // ask for teacher offer and candidate
      }
      socket.on("teacher-offer", async ({ offer, callId }) => {
        try{

            setCallId(callId);
             pc = new RTCPeerConnection(configuration);
           await  pc.setRemoteDescription(offer)
            pc.onicecandidate = (e) => {
          console.log("found ice");
          if (e.candidate)
            socket.emit("student-candidate", {
              callId,
              candidate: e.candidate,
            });
        };
        if (!studentStream) {
          studentStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          studentVideoRef.current.srcObject = studentStream;
        }
        studentStream
          .getTracks()
          .forEach((track) => pc.addTrack(track, localStream));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer)
        socket.emit("student-answer", {
          callId,
          answer,
        });
    }catch(err){
        console.log(err)
    }
    });
    socket.on(
        "teacher-candidate",
        async ({ candidate, callId, courseId }) => {
            if(!pc){
                console.log('no pc is on to get the candidate')
            }
            if (!studentStream) {
                studentStream = await navigator.mediaDevices.getUserMedia({
                  video: true,
                  audio: false,
                });
                studentVideoRef.current.srcObject = studentStream;
              }
              await pc.addIceCandidate(candidate);
        }
      );
    }
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
