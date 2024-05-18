import React, { useState, useEffect } from "react";
import { getRandomCourses } from "./utilties";
import { useOutletContext } from "react-router-dom";
import ModalPopup from "../Components/ModalPopup/ModalPopup";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";
const Home = () => {
  const { setModalState, modalState } = useOutletContext();
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    getRandomCourses(setCourses, setModalState, setLoadingFlag);
  }, []);
  return (
    <>
      {courses.length || !loadingFlag ? (
       <section className="w-7/8 m-auto min-h-screen flex flex-row items-center shrink-0 grow-0 flex-wrap justify-center pt-[100px]">
       <article className="w-full flex flex-wrap justify-center">
         {courses.map((course) => (
           <div
             className="flex flex-col p-4 border gap-2 m-6 rounded-lg bg-primaryLight border-primaryDark dark:bg-black w-full sm:w-[calc(50%-3rem)] md:w-[calc(33.33%-3rem)] lg:w-[calc(25%-3rem)]"
             key={course.id_cours}
           >
             <h1>{course.cours_name}</h1>
             <h2>starts at: {course.first_cours}</h2>
             <p>{course.cours_discription}</p>
             <button onClick={e=>{
                e.preventDefault()
                e.stopPropagation()
                navigate(`/course/${course.id_cours}`)
             }} className="text-start">
               <h1 className="font-bold text-xl hover:text-2xl text-primaryDark">see details</h1>
             </button>
           </div>
         ))}
       </article>
     </section>
     
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
};

export default Home;
