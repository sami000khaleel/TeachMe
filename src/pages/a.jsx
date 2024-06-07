import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client"; // Make sure axios is imported
import { Video, VideoOff, Mic, MicOff } from "lucide-react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

let studentStream;
let teacherStream;
let pc;
const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 1,
};

const Room = () => {
  const [callStartedFlag, setCallStartedFlag] = useState(false);
  const [isMutedFlag, setIsMutedFlag] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [teacherState, setTeacherState] = useState("offline");
  const [students, setStudents] = useState([]);
  const [gotStudentsFlag, setGotStudentsFlag] = useState(false);
  let teacherTimeOut = useRef();
  const [teacherConnection, setTeacherConnection] = useState({
    connected: false,
    streamStopped: false,
  });
  let { socket, setModalState, modalState } = useOutletContext();
  let timeOutes = useRef({});
  let peersConnections = useRef({});

  let teacherVideoRef = useRef();
  let studentVideoRef = useRef();
  const { courseId } = useParams();
  const query = useQuery();
  const [callId, setCallId] = useState(null);
  function updateStudents(student) {
    for (let stu of students) {
      if (stu.id_stu == student.id_stu) stu = student;
      setStudents(students);
    }
  }
  async function getStudents(flag) {
    try {
      const { data } = await axios.get(
        `http://127.0.0.1:3000/api/student/get_students_by_course?courseId=${courseId}`
      );
      if (!data.length) throw new Error("no students were found");

      // Add refs to each student object
      const studentsWithRefs = data.map((student) => ({
        ...student,
        studentRef: React.createRef(),
        state: "offline",
      }));
      if (flag) setGotStudentsFlag((pre) => !pre);
      console.log("got students", data.length);
      setStudents(studentsWithRefs);
    } catch (error) {
      console.log(error);
    }
  }
  const initializeStudentStream = async () => {
    try {
      studentStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      studentVideoRef.current.srcObject = studentStream;
      return studentStream;
    } catch (err) {
      console.error("Error accessing student media devices:", err);
    }
  };

  const initializeTeacherStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      teacherVideoRef.current.srcObject = stream;
      return stream;
    } catch (err) {
      console.error("Error accessing teacher media devices:", err);
    }
  };

  async function createCall() {
    if (user.role !== "teacher") return null;
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
    return data;
  }

  const teacherMakeCall = async () => {
    try {
      if (user.role != "teacher") return;

      const call = await createCall();
      if (!call) return;
      setCallId(call._id);
      if (!students.length) await getStudents(true);
      const teacherStream = await initializeTeacherStream();

      if (!teacherStream) return;
      setCallStartedFlag(true)
      socket.emit("ask-me-for-offer", { callId: call._id });
      socket.on("request-offer", async ({ studentId }) => {
        peersConnections[String(studentId)] = new RTCPeerConnection(
          configuration
        );
        peersConnections[String(studentId)].addEventListener(
          "connectionstatechange",
          (event) => {
            switch (peersConnections[String(studentId)].connectionState) {
              case "new":
              case "connecting":
                console.log("Connecting…");
                break;
              case "connected":
                console.log("Online");
                break;
              case "disconnected":
                console.log("Disconnecting…");
                break;
              case "closed":
                console.log("Offline");
                break;
              case "failed":
                console.log("Error");
                break;
              default:
                console.log("Unknown");
                break;
            }
            let stu = students.find((st) => st.id_stu == studentId);
            stu.state = peersConnections[String(studentId)].connectionState;
            updateStudents(stu);
          },
          false
        );
        teacherStream.getTracks().forEach((track) => {
          peersConnections[String(studentId)].addTrack(track, teacherStream);
        });
        peersConnections[String(studentId)].onicecandidate = (e) => {
          if (e.candidate) {
            socket.emit("teacher-candidate", {
              teacherId: user.id,
              callId: call._id,
              candidate: e.candidate,
            });
            console.log("candidate was sent");
          }
        };

        const offer = await peersConnections[String(studentId)].createOffer();
        await peersConnections[String(studentId)]
          .setLocalDescription(offer)
          .catch((err) => console.log(err));
        socket.emit("teacher-offer", { callId: call._id, offer });
        socket.on("student-answer", async ({ answer, studentId }) => {
          console.log("got student answer");
          let student = students.find((student) => student.id_stu == studentId);
          peersConnections[String(student.id_stu)].ontrack = (e) => {
            student.studentRef.current.srcObject = e.streams[0];
            console.log("got student track");
            student.connected = true;
            student.streamStopped = false;
            updateStudents(student);
            if (timeOutes[String(student.id_stu)]) {
              clearTimeout(timeOutes[String(student.id_stu)]);
            }
            setStudents(students);
          };
          await peersConnections[String(student.id_stu)]
            .setRemoteDescription(answer)
            .catch((err) => console.log(err));
          console.log("student answer was set");
        });
        socket.on("student-candidate", async ({ candidate, studentId }) => {
          console.log("got student candidate");
          if (!peersConnections[String(studentId)]) {
            console.log("no answers yet");
            return;
          }
          await peersConnections[String(studentId)]
            .addIceCandidate(candidate)
            .catch((err) => console.log(err));
          console.log("student candidate was set");
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleTeacherOffer = async (data) => {
    try {
      setCallId(data._id);
      pc = new RTCPeerConnection(configuration);
      pc.addEventListener(
        "connectionstatechange",
        async (event) => {
          switch (pc.connectionState) {
            case "new":
            case "connecting":
              console.log("Connecting…");
              break;
            case "connected":
              console.log("Online");
              break;
            case "disconnected":
              {
                setTeacherState("disconnected");
                console.log("Disconnecting…");
                teacherVideoRef.current.srcObject.getTracks()[0].stop()   
              teacherVideoRef.current.srcObject.getTracks()[1].stop() 
                pc.close()
                break;
              }
            case "closed":{
              teacherVideoRef.current.srcObject.getTracks()[0].stop()   
              teacherVideoRef.current.srcObject.getTracks()[1].stop() 
              pc.close()
              console.log("Offline");
              break;
            }
            case "failed":{
              console.log("Error");
teacherVideoRef.current.srcObject.getTracks()[0].stop()   
teacherVideoRef.current.srcObject.getTracks()[1].stop() 
pc.close()              
break;}
            default:
              console.log("Unknown");
              break;
          }
          if (pc) setTeacherState(pc.connectionState);
        },
        false
      );
      pc.ontrack = (e) => {
        teacherVideoRef.current.srcObject = e.streams[0];
        console.log("got teacher tracks");
        setTeacherConnection((pre) => ({
          connected: true,
          streamStopped: false,
        }));
        clearTimeout(teacherTimeOut);
      };
      await pc.setRemoteDescription(data.offer);
      console.log("teacher offer was set");
      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("student-candidate", {
            callId: data._id,
            candidate: e.candidate,
          });
        }
      };

        await initializeStudentStream();
      

      studentStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, studentStream));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("student-answer", {
        callId: data._id,
        answer,
      });
      if (data?.teacherCandidate) {
        data.candidate = data.teacherCandidate;
      }
      await pc.addIceCandidate(data.candidate);
    } catch (err) {
      console.error("Error handling teacher offer:", err);
    }
  };
  useEffect(() => {
    getStudents(false);
    if (socket) {
      if (user.role == "student") {
        // if (query.get("callOnGoing") === "yes") {
        const requestCall = async () => {
          try {
            const { data } = await axios.get(
              `http://localhost:3000/api/student/request_call?courseId=${courseId}`
            );
            setCallId(data._id);
            socket.emit("request-offer", { callId: data._id });
            // await handleTeacherOffer(data);
            // if (courseId) socket.emit("student-ask-for-call", { courseId });
          } catch (err) {
            console.error("Error requesting call:", err);
          }
        };
        requestCall();
        socket.on("ask-me-for-offer", async ({ callId }) => {
          if (pc?.connectionState == "connected") return;
          console.log("time to ask for offer");
          socket.emit("request-offer", { callId });
        });
        socket.on("teacher-offer", async ({ offer, callId }) => {
          try {
            if (pc?.connectionState == "connected") return;
          pc=null
            console.log("got teacher offer");
            await handleTeacherOffer({ offer, _id: callId });
          } catch (err) {
            console.error("Error handling teacher offer:", err);
          }
        });

        socket.on("teacher-candidate", async ({ candidate }) => {
          if (pc?.connectionState == "connected") return;
          if (!pc) {
            console.log("No peer connection to handle candidate");
            return;
          }
          try {
            console.log("got teacher candidate");
            await pc
              .addIceCandidate(candidate)
              .catch((err) => console.log(err));
            console.log("teacher candidate was set");
          } catch (err) {
            console.error("Error adding ICE candidate:", err);
          }
        });
        socket.on("teacher-disconnected", ({ teacherId }) => {
          let tCnct = teacherConnection;
          tCnct.streamStopped = true;
          teacherTimeOut = setTimeout(() => {
            tCnct.streamStopped = true;
            tCnct.connected = false;
          }, 5000);
          setTeacherConnection(tCnct);
        });
      }
    }
    return () => {
      if (socket) {
        socket.emit("student-exit-call");
        socket.off("no-call");
        socket.off("teacher-offer");
        socket.off("teacher-candidate");
        socket.off("teacher-disconnect");
        socket.off("student-disconnect");
      }
      if (pc) {
        pc.close();
      }
    };
  }, [socket]);
  async function endCall(){
     for(let key in peersConnections){
        if(peersConnections[key]?.connectionState)
          peersConnections[key].close()
      }
      teacherVideoRef.current.srcObject.getTracks()[0].stop()   
      teacherVideoRef.current.srcObject.getTracks()[1].stop()   
      setCallStartedFlag(false)
    }
  if (socket)
    return (
      <>
        {user.role == "student" || students.length ? (
          <section
            id="room"
            className="relative   w-full flex flex-col justify-start items-center"
          >
            {user.role == "student" && (
              <div className="text-center absolute w-[100px] z-50 right-1/2 top-1/2 translate-x-[50%] -translate-y-1/2  ">
                {teacherState == "offline" ? null : teacherState}
              </div>
            )}
            {/* <StudentsAttendingList students /> */}
            <div className="relative ">
              <video
                ref={teacherVideoRef}
                className="bg-black max-h-[50vh] mt-[100px] relative w-screen shadow-xl max-w-[1000px] min-w-[340px]"
                autoPlay
                playsInline
              ></video>
              <div className="flex mt-3 flex-row justify-evenly items-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    !callStartedFlag ? teacherMakeCall() : endCall();
                  }}
                  className="bg-white text-black"
                >
                  {!callStartedFlag ? <Video /> : <VideoOff />}
                </button>
                <button className="bg-white text-black">
                  {isMutedFlag ? <Mic /> : <MicOff />}
                </button>
              </div>
              {students.length &&
                students.map((student) => (
                  <div
                    key={student.id_stu}
                    className="flex flex-col justify-center items-center gap-2"
                  >
                    <video
                      playsInline
                      autoPlay
                      ref={student.studentRef}
                      className="bg-black w-[150px] aspect-square"
                    ></video>
                  </div>
                ))}
            </div>
            <video
              playsInline
              autoPlay
              ref={studentVideoRef}
              className="absolute right-0 bottom-0 bg-black w-[150px] aspect-square"
            ></video>
            {callId&&pc?.connectionState=='closed'?<button className="bg-white text-black absolute bottom-2 left-2" onClick={()=>{
            socket.emit('request-offer',{callId})
          }} >connect</button>:null}
          </section>
        ) : null}
      </>
    );
};

export default Room;
