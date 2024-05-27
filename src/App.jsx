import React, { useRef, useEffect, useState } from "react";
import Cookies from "js-cookies";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "./index.css";
import ModalPopup from "./Components/ModalPopup/ModalPopup";
import { handleThemeInit } from "./App";
import Navbar from "./Components/Navbar/Navbar";
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
      role: "student",
    };
  });
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    handleThemeInit(setTheme);
  }, []);
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
