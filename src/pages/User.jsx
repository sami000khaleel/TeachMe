import React, { useEffect, useState } from "react";
import CourseForm from "../Components/CourseForm/CourseForm";
import { useOutletContext } from "react-router-dom";
import { getTeachersCourses, getStudentCourses } from "./utilities.jsx";
import Courses from "../Components/Courses/Courses";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";
const User = () => {
  const [updateMode,setUpdateMode]=useState(false)
  const [loadingFlag, setLoadingFlag] = useState(false);
  const { user, setModalState } = useOutletContext();
  const [teachersCourses, setTeachersCourses] = useState([]);
  const [studentCourses, setStudentCourses] = useState([]);
  const [selectedCourse,setSelectedCourse]=useState({})
  useEffect(() => {
    // fetch the teachers courses
    if (user.role == "teacher")
      getTeachersCourses(setTeachersCourses, setModalState, setLoadingFlag);
    if (user.role == "student")
      getStudentCourses(
        user.id,
        setLoadingFlag,
        setStudentCourses ,
        setModalState
      );
  }, []);
  return (
    <section
      id="uesrs page"
      className="w-full  flex flex-col items-center justify-center h-full "
    >
      {user.role == "teacher" ? (
        <article id='form' className="h-screen flex justify-center items-center w-full">
          <CourseForm setSelectedCourse={setSelectedCourse}  userId={user.id} selectedCourse={selectedCourse} setUpdateMode={setUpdateMode} updateMode={updateMode} setTeachersCourses={setTeachersCourses} />
        </article>
      ) : null}

      {loadingFlag ? (
        <div className="w-full flex flex-col justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : teachersCourses.length||studentCourses.length ? (
        <article
          className="flex flex-col justify-center items-center mt-5 w-full"
          id="teachers courses"
        >
          <h1 className="text-center w-full font-bold text-3xl ">
            your courses
          </h1>
          <div className="max-w-[600px] flex flex-col items-center justify-center w-full">
            <Courses setUpdateMode={setUpdateMode} setSelectedCourse={setSelectedCourse}  courses={teachersCourses.length?teachersCourses:studentCourses} />
          </div>
        </article>
      ) : (
        <h1 className=" my-8  dark:text-white text-black font-bold text-3xl ">
          you have no courses
        </h1>
      )}
    </section>
  );
};

export default User;
