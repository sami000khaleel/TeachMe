import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { dateTrimmer } from "../../../App";
import { Settings, Delete, Trash } from "lucide-react";
import {handleDeleteCourse} from '../../../App'
import { useOutletContext } from "react-router-dom";
const Course = ({ course, teachersCourseFlag,setUpdateMode ,setSelectedCourse}) => {
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [deletedFlag, setDeletedFlag] = useState(false);
  const {setModalState}=useOutletContext()
  const navigate = useNavigate();

  return (
    <>
      {course?.id_cours ? (
        <div
          className={`relative flex justify-between flex-col p-4 border m-6 rounded-lg bg-white border-primaryDark dark:bg-black w-full ${
            deletedFlag ? "hidden" : ""
          }`}
          key={course.id_cours}
        >
          {new Date(course.first_cours) > new Date()&&teachersCourseFlag ? (
            <article className="flex gap-3 absolute right-5" id="actions">
              <a href="#form">
                <Settings onClick={
                  (e)=>{
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedCourse(course)
                    setUpdateMode(true)
                  }
                } />
              </a>
              <Trash
                onClick={handleDeleteCourse(
                  course,
                  setLoadingFlag,
                  setDeletedFlag,
                  setModalState
                )}
                cursor={"pointer"}
              />
            </article>
          ) : null}
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
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/course/${course.id_cours}`);
            }}
            className="text-start w-full py-2 rounded-lg text-primaryDark font-bold hover:text-primaryDark"
          >
            See Details
          </button>
        </div>
      ) : (
        <div className="flex justify-between flex-col p-4 border m-6 rounded-lg bg-white border-primaryDark dark:bg-black w-full"></div>
      )}
    </>
  );
};

export default Course;
