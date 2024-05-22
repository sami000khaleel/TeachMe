import React, { useEffect, useState } from "react";
import ModalPopup from "../Components/ModalPopup/ModalPopup";
import { useOutletContext, useParams } from "react-router-dom";
import { checkStudentIsEnrolled,getCourseInfo } from "./utilties";
const Course = () => {
  const { courseId } = useParams();
  
  const [studentIsEnrolledFlag, setStudentIsEnrolledFlag] = useState(false);
  const [loadingFlag, setLoadingFlag] = useState(true);
  const [course,setCourse]=useState({})
  const { modalState, setModalState, setTheme, user, setUser } =
    useOutletContext();
  useEffect(() => {
    if(user.role=='student')
     checkStudentIsEnrolled(
      user.id,
      setModalState,
      setLoadingFlag,
      setStudentIsEnrolledFlag,
      courseId
    );
    else
       setStudentIsEnrolledFlag(false)
    
  }, []);
  useEffect(()=>{
    getCourseInfo(courseId,setLoadingFlag,setCourse,setModalState)
  },[])
  console.log(studentIsEnrolledFlag)
  return <section className=" w-full h-screen pt-[200px]  flex-col justify-center items-center">
<div className="flex flex-col p-4 border m-6 rounded-lg bg-white shadow-xl dark:bg-black">
  <h1 className="text-xl font-bold mb-2 text-black dark:text-white">{course.cours_name}</h1>
    <p className="text-black dark:text-white">Starts at: {course.first_cours?.split('T')[0]}</p>
    <p className="text-black dark:text-white">Ends at: {course.end_cours?.split('T')[0]}</p>
    <h1 className="text-xl font-bold mb-2 text-black dark:text-white">{course.cours_name}</h1>
  <span>
    <h1 className="text-gray-700 mb-4  dark:text-white">every week at : </h1>
    <p className="text-black dark:text-white">{course.date1}</p>
    <p className="text-black dark:text-white">{course.date2}</p>
  </span>
  <div className="flex justify-between items-center w-full">
  </div>
  <button onClick={console.log('a')} disabled={studentIsEnrolledFlag} className={`bg-primaryDark mt-5 text-black dark:text-white font-bold py-2 px-4 rounded hover:bg-blue-700 ${studentIsEnrolledFlag?'cursor-not-allowed':'cursor-pointer'}`}>{studentIsEnrolledFlag?'Enrolled':'Enroll' }</button>
</div>

  </section>;
};

export default Course;
