import React, { useEffect, useState } from "react";
import ModalPopup from "../Components/ModalPopup/ModalPopup";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import {
  checkStudentIsEnrolled,
  getCourseInfo,
  enrollStudent,
  fetchTeachersCourseDetails,
  giveCourseAction,
  checkTime,
} from "./utilities.jsx";
import { dateTrimmer } from "../App";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";

const Course = () => {
  const { courseId } = useParams();
  const [teacherGivesCourseFlag, setTeacherGivesCourseFlag] = useState(false);
  const navigate = useNavigate();
  const [studentIsEnrolledFlag, setStudentIsEnrolledFlag] = useState(false);
  const [loadingFlag, setLoadingFlag] = useState(false);
  const {
    modalState,
    setModalState,
    setTheme,
    user,
    setUser,
    students,
    course,
    setCourse,
    setStudents,
  } = useOutletContext();

  useEffect(() => {
    if (user.role === "student") {
      checkStudentIsEnrolled(
        user.id,
        setModalState,
        setLoadingFlag,
        setStudentIsEnrolledFlag,
        courseId
      );
      getCourseInfo(courseId, setLoadingFlag, setCourse, setModalState);
    } else {
      setStudentIsEnrolledFlag(false);
      fetchTeachersCourseDetails(
        courseId,
        setLoadingFlag,
        setModalState,
        setStudents,
        setCourse,
        setTeacherGivesCourseFlag
      );
    }
  }, [courseId]);

  return (
    <section className="flex flex-col justify-center items-center min-h-screen w-full">
      {course?.id_cours ? (
        <div
          className="max-w-[600px] flex justify-between flex-col p-4 border m-6 rounded-lg bg-white border-primaryDark dark:bg-black w-full"
          key={course.id_cours}
        >
          <h1 className="text-xl font-bold mb-2">{course.cours_name}</h1>
          <h1>{course.cours_discription}</h1>
          <article className="my-3" id="deadlines">
            {new Date(course.first_cours) > new Date() ? (
              <h2 className="text-gray-500">
                starts at: {dateTrimmer(course.first_cours)}
              </h2>
            ) : (
              "on going"
            )}
            <h2 className="text-gray-500">
              end at: {dateTrimmer(course.end_cours)}
            </h2>
          </article>
          <h1>every week at :</h1>
          <article
            className="my-2 flex flex-col justify-center items-start"
            id="dates"
          >
            <h1 className="text-gray-500">{course.date1}</h1>
            <h1 className="text-gray-500">{course.date2}</h1>
          </article>

          {!(new Date(course.first_cours) > new Date()) ? (
            giveCourseAction(
              teacherGivesCourseFlag,
              setStudentIsEnrolledFlag,
              user,
              checkTime(course.date1, course.date2), //bool tells wether it is time for the lecture or not
              navigate,
              courseId
            )
          ) : user.role == "teacher" || studentIsEnrolledFlag ? (
            <h2 className="text-primaryDark font-bold text-xl my-4">
              course has not begun yet
            </h2>
          ) : (
            <button
              onClick={() =>
                enrollStudent(
                  courseId,
                  setModalState,
                  setLoadingFlag,
                  navigate,
                  setStudentIsEnrolledFlag
                )
              }
              className="text-white bg-primaryDark rounded-lg py-2 hover:bg-primaryDarkBackground text-xl"
            >
              enroll
            </button>
          )}
        </div>
      ) : (
        <div className="flex justify-between flex-col p-4 border m-6 rounded-lg bg-white border-primaryDark dark:bg-black w-full"></div>
      )}

      {user.role === 'teacher' && teacherGivesCourseFlag && (
        <article id='students-in-the-course' className="max-w-[600px] p-4 border m-6 rounded-lg bg-white border-primaryDark dark:bg-black w-full">
          <h1 className="dark:text-white font-bold text-2xl text-black mb-4">Students in the course:</h1>
          {students.map((student) => (
            <div key={student.id_stu} className="flex items-center my-2 p-2 border rounded-lg bg-gray-100 dark:bg-gray-800 w-full">
              <img
                src={student.image_url}
                alt={`${student.first_name_stu} ${student.last_name_stu}`}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-bold text-black dark:text-white">{student.first_name_stu} {student.last_name_stu}</h2>
                <p className="text-gray-500 dark:text-gray-400">{student.email_stu}</p>
              </div>
            </div>
          ))}
        </article>
      )}
    </section>
  );
};

export default Course;
