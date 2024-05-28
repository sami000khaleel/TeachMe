import React, { useState, useEffect } from "react";
import { getRandomCourses } from "./utilities";
import Courses from "../Components/Courses/Courses";
import { useOutletContext } from "react-router-dom";
import ModalPopup from "../Components/ModalPopup/ModalPopup";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";
const Home = () => {
    const navigate=useNavigate()
  const { setModalState, modalState,courses,setCourses } = useOutletContext();
  const [loadingFlag, setLoadingFlag] = useState(false);
  useEffect(() => {
    getRandomCourses(setCourses, setModalState, setLoadingFlag);
  }, []);
  return (
    <>
       
       <section className="w-7/8 m-auto min-h-screen flex flex-row items-center max-w-[600px] shrink-0 grow-0 flex-wrap justify-center pt-[100px]">
     {courses.length || !loadingFlag ?
     (<Courses courses={courses} />
    ) : (
      <LoadingSpinner />
      )}
     </section>
     
    </>
  );
};

export default Home;
