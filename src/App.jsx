import React, { useRef, useEffect, useState } from "react";
import Cookies from "js-cookies";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "./index.css";
import ModalPopup from "./Components/ModalPopup/ModalPopup";
import { handleThemeInit } from "./App";
import Navbar from "./Components/Navbar/Navbar";
import { io } from "socket.io-client";
import api from "./api/api";
import { VideoIcon,VideoOffIcon,MicIcon,MicOffIcon } from "lucide-react";
let user = JSON.parse(localStorage.getItem("user"));
let socket;

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState({});
  
  const [modalState, setModalState] = useState({
    message: "",
    status: "",
    errorFlag: false,
    hideFlag: true,
  });
  const [theme, setTheme] = useState("");
  const [user, setUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) return user;
    return {
      id: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      code: "",
      imageUrl: "",
      role: "",
    };
  });
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    handleThemeInit(setTheme);
  }, []);
  useEffect(() => {
    if (user?.role) {
      socket = io.connect("http://127.0.0.1:3000/", {
        auth: {
          role: user.role,
          email: user.email,
          password: user.password,
          id: user.id,
        },
      });

      if (user.role == "student") {
        socket.on("teacher-candidate", async ({ offer, callId, courseId }) => {
          if (window.location.pathname.includes("room")) return;
          const res = window.confirm(
            "a lesson is being conducted would you like to join ? "
          );
          if (res) navigate(`/room/${courseId}?callOnGoing=yes`);
       else{
        console.log('a')
       }
        });
      }
    }
  }, [user.id]);
  return (
    <main className="px-4  flex-col justify-center items-center text-black dark:text-primaryDarkText   relative min-h-screen bg-primaryLightBackground dark:bg-primaryDarkBackground">
      {!modalState.hideFlag ? (
        <ModalPopup setModalState={setModalState} modalState={modalState} />
      ) : null}
      <Navbar
        theme={theme}
        setTheme={setTheme}
        user={user}
        setCourses={setCourses}
        modalState={modalState}
        setModalState={setModalState}
        setUser={setUser}
      />
      <Outlet
        context={{
          socket,
          modalState,
          setModalState,
          setTheme,
          user,
          setUser,
          courses,
          setCourses,
          course,
          setCourse,
          students,
          setStudents,
        }}
      />
    </main>
  );
};

export default App;
