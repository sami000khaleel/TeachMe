import React, { useEffect, useState } from "react";
import CourseForm from "../Components/CourseForm/CourseForm";
import { useOutletContext } from "react-router-dom";
import { getTeachersCourses } from "./utilities.jsx";
import Courses from "../Components/Courses/Courses";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";
const User = () => {
  const [loadingFlag, setLoadingFlag] = useState(false);
  const { user, setModalState } = useOutletContext();
  const [teachersCourses, setTeachersCourses] = useState([]);

  useEffect(() => {
    // fetch the teachers courses
    if(user.role=='teacher')
      getTeachersCourses(setTeachersCourses, setModalState, setLoadingFlag);
  }, []);
  console.log(teachersCourses)
  return (
    <section id="uesrs page" className="w-full  flex flex-col items-center justify-center h-full ">
    {user.role=='teacher'? <article className="h-screen flex justify-center items-center w-full">

      <CourseForm setTeachersCourses={setTeachersCourses} />
     </article>:null}
     
      {loadingFlag?<div className="w-full flex flex-col justify-center items-center"><LoadingSpinner/></div>:teachersCourses.length?<article className="flex flex-col justify-center items-center mt-5 w-full" id="teachers courses">
        <h1 className="text-center w-full font-bold text-3xl ">your courses</h1>
        <div className="max-w-[600px] flex flex-col items-center justify-center w-full">
          <Courses courses={teachersCourses} />
        </div>
      </article>:<h1 className=" my-8  dark:text-white text-black font-bold text-3xl " >
        you have no courses
        </h1>}
    </section>
  );
};

export default User;
