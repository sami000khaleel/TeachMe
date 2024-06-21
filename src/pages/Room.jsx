import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client"; // Make sure axios is imported
import { Video, VideoOff, Mic, MicOff, Send } from "lucide-react";
import Messages from "../Components/Messages/Messages";
import Cookies from "js-cookies";

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
  const user = JSON.parse(localStorage.getItem("user"));
  const [frameIntervalId, setFrameIntervalId] = useState(null);
  const [flag, setFlag] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [showCameraMenu, setShowCameraMenu] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [requestCallFlag, setRequestCallFlag] = useState(false);
  const [callStartedFlag, setCallStartedFlag] = useState(false);
  const [isMutedFlag, setIsMutedFlag] = useState(false);
  const [teacherState, setTeacherState] = useState("offline");
  const [students, setStudents] = useState([]);
  const [gotStudentsFlag, setGotStudentsFlag] = useState(false);
  let teacherTimeOut = useRef();
  const [teacherConnection, setTeacherConnection] = useState({
    connected: false,
    streamStopped: false,
  });
  const [message, setMessage] = useState({
    studentId: String(user.id),
    studentName: `${user.firstname} ${user.lastname}`,
    studentImage: user.imageUrl,
    content: "",
  });
  let { socket, setModalState, modalState } = useOutletContext();
  let timeOutes = useRef({});
  let peersConnections = useRef({});
  const [messages, setMessages] = useState([]);
  let teacherVideoRef = useRef();
  let studentVideoRef = useRef();
  const { courseId } = useParams();
  const query = useQuery();
  const [callId, setCallId] = useState(null);
  const sendFrameToServer = async (stream, studentId) => {
    try {
      if ("ImageCapture" in window) {
        // Use ImageCapture API
        const videoTrack = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(videoTrack);
        const blob = await imageCapture.takePhoto();
        const formData = new FormData();
        formData.append("file", blob, `${studentId}.jpg`);

        const response = await axios.post(
          "/api/student/check_frame",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Fallback to using a hidden video element
        const videoElement = document.createElement("video");
        videoElement.srcObject = stream;
        videoElement.play();
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        const context = canvas.getContext("2d");
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
          const formData = new FormData();
          formData.append("frame", blob, `${studentId}.jpg`);

          const response = await axios.post(
            "/api/student/check_frame",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("Frame sent successfully using fallback:", response.data);
        });
      }
    } catch (error) {
      console.error("Error capturing or sending frame:", error);
    }
  };

  const getAvailableCameras = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });

      const devices = await navigator.mediaDevices.enumerateDevices();
      let cameras = devices.filter((device) => device.kind === "videoinput");
      setCameras(cameras);
      setSelectedCamera(cameras[0].deviceId);
      return cameras;
    } catch (err) {
      console.log(err);
    }
  };
  function updateStudents(updatedStudent) {
    console.log(updatedStudent, "updated student");
    const updatedStudents = students.map((student) =>
      student.id_stu === updatedStudent.id_stu ? updatedStudent : student
    );
    console.log(updatedStudents, "updates students");
    const onlineStudents = updatedStudents.filter(
      (student) => student.state !== "offline"
    );
    console.log(onlineStudents, "online online");
    const offlineStudents = updatedStudents.filter(
      (student) => student.state === "offline"
    );
    console.log(offlineStudents, "offoff off ");
    setStudents([...onlineStudents, ...offlineStudents]);
  }
  const updateTeacherStream = async (deviceId) => {
    try {
      const constraints = {
        video: { deviceId: { exact: deviceId } },
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      teacherVideoRef.current.srcObject = stream;

      // Update the peer connections with the new stream
      for (const key in peersConnections.current) {
        const peerConnection = peersConnections.current[key];
        peerConnection.getSenders().forEach((sender) => {
          if (sender.track.kind === "video") {
            sender.replaceTrack(stream.getVideoTracks()[0]);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  async function getStudents(flag) {
    try {
      const { data } = await axios.get(
        `/api/student/get_students_by_course?courseId=${courseId}`
      );
      if (!data.length) throw new Error("no students were found");

      // Add refs to each student object
      const studentsWithRefs = data.map((student) => ({
        ...student,
        studentRef: React.createRef(),
        state: "offline",
        warning: "",
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

  const initializeTeacherStream = async (deviceId) => {
    try {
      const constraints = {
        video: { deviceId: deviceId ? { exact: deviceId } : undefined },
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      teacherVideoRef.current.srcObject = stream;
      return stream;
    } catch (err) {
      console.error("Error accessing teacher media devices:", err);
    }
  };
  console.log(cameras);
  async function createCall() {
    if (user.role !== "teacher") return null;
    const { data } = await axios.post(
      `/api/teacher/create_lesson`,
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
      const teacherStream = await initializeTeacherStream(selectedCamera);

      if (!teacherStream) return;
      setCallStartedFlag(true);
      socket.emit("ask-me-for-offer", { callId: call._id });
      socket.on("request-offer", async ({ studentId }) => {
        console.log("teacher was asked for offer", studentId);
        peersConnections[String(studentId)] = new RTCPeerConnection(
          configuration
        );
        peersConnections[String(studentId)]?.addEventListener(
          "connectionstatechange",
          (event) => {
            switch (peersConnections[String(studentId)]?.connectionState) {
              case "new":
              case "connecting":
                console.log("Connecting…");
                break;
              case "connected":
                let stu = students.find((st) => st.id_stu == studentId);
                if (stu) {
                  stu = {
                    ...stu,
                    state: peersConnections[String(studentId)].connectionState,
                  };
                  updateStudents(stu);
                  socket.emit("student-joined-call", {
                    studentId,
                    callId: call._id,
                  });
                }
                setFlag((pre) => !pre);
                console.log("Online");

                break;
              case "disconnected": {
                console.log("Disconnecting…");
                let stu = students.find((st) => st.id_stu == studentId);
                if (stu) {
                  stu = {
                    ...stu,
                    state: peersConnections[String(studentId)].connectionState,
                  };
                  updateStudents(stu);
                }
                setFlag((pre) => !pre);
                peersConnections[String(studentId)].close();
                peersConnections[String(studentId)] = null;
                socket.emit("student-out", { studentId, callId: call._id });
                break;
              }
              case "closed": {
                console.log("Offline");
                let stu = students.find((st) => st.id_stu == studentId);
                if (stu) {
                  stu = {
                    ...stu,
                    state: peersConnections[String(studentId)]?.connectionState,
                  };
                  updateStudents(stu);
                }
                setFlag((pre) => !pre);
                peersConnections[String(studentId)].close();

                break;
              }
              case "failed": {
                console.log("Error");
                let stu = students.find((st) => st.id_stu == studentId);
                if (stu) {
                  stu = {
                    ...stu,
                    state: peersConnections[String(studentId)].connectionState,
                  };
                  updateStudents(stu);
                }
                setFlag((pre) => !pre);
                peersConnections[String(studentId)].close();

                break;
              }
              default:
                console.log("Unknown");
                break;
            }
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
            case "connected": {
              setRequestCallFlag(false);
              console.log("Online");

              break;
            }
            case "disconnected":
              setTeacherState("disconnected");
              console.log("Disconnecting…");
              clearInterval(frameIntervalId);
              teacherVideoRef.current.srcObject.getTracks()[0].stop();
              teacherVideoRef.current.srcObject.getTracks()[1].stop();
              // pc.close()
              // pc=null
              setRequestCallFlag(true);
              break;

            case "closed":
              teacherVideoRef.current.srcObject.getTracks()[0].stop();
              teacherVideoRef.current.srcObject.getTracks()[1].stop();
              clearInterval(frameIntervalId);
              pc.close();
              pc = null;
              setRequestCallFlag(true);

              console.log("Offline");
              break;

            case "failed":
              console.log("Error");
              teacherVideoRef.current.srcObject.getTracks()[0].stop();
              teacherVideoRef.current.srcObject.getTracks()[1].stop();
              clearInterval(frameIntervalId);
              pc.close();
              pc = null;
              setRequestCallFlag(true);
              break;

            default:
              console.log("Unknown");
              break;
          }
          if (pc) {
            setTeacherState(pc.connectionState);
            if (pc.connectionState == "connecting")
              setTeacherConnection("ask for connection");
          }
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
      let answer;
      answer = await pc.createAnswer().catch((err) => console.log(err));
      //   setTimeout(async () => {
      //     answer = await pc.createAnswer().catch(err=>console.log(err));
      //   }, 2000)
      // );
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
              `/api/student/request_call?courseId=${courseId}`
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
        socket.on("teacher-end-call", ({ callId }) => {
          if (pc) {
            pc.close();
            pc = null;
            console.log("student-closed-the-pc");
            setTeacherState("offline");
          }
        });
        socket.on("ask-me-for-offer", async ({ callId }) => {
          // if (pc?.connectionState == "connected") return;
          console.log("time to ask for offer");
          setRequestCallFlag(true);
          socket.emit("request-offer", { callId });
        });

        socket.on("teacher-offer", async ({ offer, callId }) => {
          try {
            if (pc?.connectionState == "connected") return;
            if (pc) {
              pc.close();
              pc = null;
            }
            socket.emit("request-messages", { callId });
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
          } catch (err) {
            console.error("Error adding ICE candidate:", err);
          }
        });
        socket.on("teacher-disconnected", ({ teacherId }) => {
          if (!pc) return;
          pc.close();
          pc = null;
          setTeacherConnection("offline");
        });
      }
      socket.on('warning',async({warning})=>{
        setModalState({
          message:warning,
          status:200,
          errorState:false,
          warningState:true,
          hideFlag:false
        })
      })
      socket.on("recieve-messages", ({ messages }) => {
        setMessages(messages);
      });
      socket.on("message", ({ message }) => {
        setMessages((prev) => [...prev, message]);
      });
      socket.emit("request-messages", { callId });
    }
    return () => {
      console.log("out");
      if (socket) {
        socket.off("message");

        socket.emit("student-exit-call");
        socket.off("no-call");
        socket.off("student-candidate");
        socket.off("student-answer");
        socket.off("teacher-offer");
        socket.off("teacher-candidate");
        socket.off("teacher-disconnect");
        socket.off("student-disconnect");
      }
      if (Object.keys(peersConnections).length && user.role == "teacher") {
        let keys = Object.keys(peersConnections);
        console.log(keys, peersConnections);
        if (keys?.length)
          for (let key of keys) {
            console.log(key)
            if (peersConnections[key] && key != "current")
              peersConnections[key].close();
          }
      }

      if (pc) {
        pc.close();
        clearInterval(frameIntervalId);
        if (user.role == "teacher") socket.emit("teacher-end-call", { callId });
      }
    };
  }, [socket]);
  async function endCall() {
    for (let key in peersConnections) {
      if (peersConnections[key]?.connectionState) {
        peersConnections[key].close();
        peersConnections[key] = null;
      }
      socket.emit("teacher-end-call", { callId });
    }
    teacherVideoRef.current.srcObject.getTracks()[0].stop();
    teacherVideoRef.current.srcObject.getTracks()[1].stop();
    setCallStartedFlag(false);
  }
  const toggleSound = () => {
    if (!teacherVideoRef.current.srcObject) return;

    teacherVideoRef.current.srcObject.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setIsMutedFlag((prev) => !prev);
  };
  useEffect(() => {
    if (user?.role != "teacher") return;
    getAvailableCameras();
  }, []);
  useEffect(() => {
    function handleFramesInterval() {
      if (user?.role == "teacher") return;
      if (pc?.connectionState != "connected")
        return clearInterval(frameIntervalId);
      if (!studentStream || !user?.id) return;

      let id = setInterval(() => {
        sendFrameToServer(studentStream, user.id);
      }, 1000);
      setFrameIntervalId(id);
    }
    handleFramesInterval();
  }, [pc?.connectionState]);

  const [isDragging, setIsDragging] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [yOff, setYOff] = useState(0);
  const [xOff, setXOff] = useState(0);
  const [savedY, setsavedY] = useState(0);
  const [savedX, setSavedX] = useState(0);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setX(event.clientX);
    setY(event.clientY);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      setXOff(savedX + (event.clientX - x));
      setYOff(savedY + (event.clientY - y));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const rect = studentVideoRef.current.getBoundingClientRect();

    setSavedX(rect.left);
    setsavedY(rect.top);
  };
  useEffect(() => {
    if(user.role=='teacher')return
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  if (socket)
    return (
      <div>
        {user.role === "teacher" ? (
          <div className="absolute top-[100px] z-[99999999999999999999999]">
            <button
              className="text-black  z-[999999999999999999999999]  bg-white p-2 rounded-full"
              onClick={() => setShowCameraMenu((prev) => !prev)}
            >
              Switch Camera
            </button>
            {showCameraMenu && (
              <div className="absolute  bg-white p-2 rounded-lg shadow-lg">
                <ul className="mt-[100px] ">
                  {cameras.map((camera) => (
                    <li
                      key={camera.deviceId}
                      className={`text-black  cursor-pointer p-2 ${
                        camera.deviceId === selectedCamera ? "bg-gray-200" : ""
                      }`}
                      onClick={() => {
                        setSelectedCamera(camera.deviceId);
                        updateTeacherStream(camera.deviceId);
                        setShowCameraMenu(false);
                      }}
                    >
                      {camera.label || `Camera ${camera.deviceId}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}
        {user.role == "student" || students.length ? (
          <section
            id="room"
            className="relative pt-[100px]  w-full flex flex-col justify-center items-center"
          >
            {user.role == "student" ? (
              <div className=" z-[9999999] flex flex-col justify-center items-center fixed bottom-0 left-2">
                <div className="text-center  w-[100px] z-50   ">
                  {teacherState == "offline" ? null : teacherState}
                </div>
                {pc &&
                teacherState != "connected" &&
                teacherState != "disconnected" ? (
                  <button
                    className="  text-white p-3 rounded-xl bg-green-500   "
                    onClick={() => {
                      if (pc) pc.close();
                      pc = null;
                      socket.emit("request-offer", { callId });
                    }}
                  >
                    connect
                  </button>
                ) : null}
              </div>
            ) : null}

            {/* <StudentsAttendingList students /> */}
            <div className="relative flex flex-col ">
              <div className="w-full aspect-video bg-black">
                <video
                  ref={teacherVideoRef}
                  className="aspect-video h-[400px]  "
                  autoPlay
                  playsInline
                ></video>
              </div>
              {user.role == "teacher" ? (
                <div className="flex mt-3 flex-row justify-evenly items-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      !callStartedFlag ? teacherMakeCall() : endCall();
                    }}
                    className="bg-white rounded-full p-2 text-black"
                  >
                    {!callStartedFlag ? (
                      <Video size={40} />
                    ) : (
                      <VideoOff size={40} />
                    )}
                  </button>
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSound();
                    }}
                    className="bg-white rounded-full p-2 text-black"
                  >
                    {isMutedFlag ? <Mic size={40} /> : <MicOff size={40} />}
                  </button>
                </div>
              ) : null}
              {students.length && user.role == "teacher" ? (
                <div className="flex sm:flex-col justify-center gap-2 w-6/8  items-start mt-4">
                  {students.map((student) => (
                    <div
                      key={student.id_stu}
                      className="dark:bg-gray-800 bg-white  w-full flex sm:flex-row flex-col  justify-around gap-3 rounded-xl p-2 items-center  px-5 "
                    >
                      <img
                        className="w-[80px] rounded-full aspect-square"
                        src={`https://${import.meta.env.VITE_SERVER_ADDRESS}/${
                          student.image_url
                        }`}
                        alt={`${student.first_name_stu} ${student.last_name_stu}`}
                      />
                      <h1>
                        {student.first_name_stu} {student.last_name_stu}
                      </h1>
                      <h1>
                        {peersConnections[String(student.id_stu)]
                          ?.connectionState || "offline"}
                      </h1>
                      <video
                        playsInline
                        autoPlay
                        ref={student.studentRef}
                        className=" bg-black w-[150px] m-2  aspect-video"
                      ></video>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            {user.role == "student" ? (
              <video
                playsInline
                autoPlay
                ref={studentVideoRef}
                className="fixed  w-[150px] aspect-square"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{
                  top: yOff,
                  left: xOff,
                  borderRadius: "40px",
                  overflow: "hidden",
                }}
              ></video>
            ) : null}
            <Messages
              pc={pc}
              callId={callId}
              setMessage={setMessage}
              message={message}
              messages={messages}
              socket={socket}
            />
          </section>
        ) : null}
      </div>
    );
};

export default Room;