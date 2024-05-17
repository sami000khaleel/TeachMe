import React, { useState } from "react";
import ModalPopup from "../Components/ModalPopup/ModalPopup";
import { Link, useOutlet, useOutletContext } from "react-router-dom";
import { userDataChange, handleLoginStudent,handleLoginTeacher } from "./utilties";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const { modaState, setModalState, user, setUser } = useOutletContext();
  const [loadingFlag, setLoadingFlag] = useState(false);
  const navigate=useNavigate()
  return (
    <article className="flex justify-center items-center w-full h-screen" >

      <form className="mx-4 flex flex-col gap-5 shadow-xl w-full max-w-md p-8 bg-white dark:bg-black  rounded-xl">
        <h2 className="text-3xl font-bold  mb-4">Log in</h2>
    <span className="flex flex-row items-center " >


<label htmlFor="role" className="text-primaryLightText dark:text-primaryDarkText dark:bg-primaryDarkBackground bg-primaryLightBackground justify-center w-[300px] hover:opacity-80 flex  ">
  I am a teacher
</label>
        <input
  type="checkbox"
  id="role"
  name="role"
  value="teacher"
  onChange={(e) => {
    if (e.target.checked) {
      setUser((prevUser) => ({...prevUser, role:'teacher' }));
    } else {
      setUser((prevUser) => ({...prevUser, role: 'student' }));
    }
  }}
  className="block w-full bg-primaryLightBackground    p-2 pl-3 font-bold dark:text-black"
/>
  </span>
        <input
          type="email"
          value={user.email}
          onChange={userDataChange(setUser)}
          placeholder="Type in your email"
          name="email"
          id="email"
          className="block w-full bg-primaryLightBackground    p-2 pl-3 font-bold dark:text-black"
        />
        <input
          type="password"
          value={user.password}
          onChange={userDataChange(setUser)}
          placeholder="Type in your password"
          name="password"
          id="password"
          className="block w-full bg-primaryLightBackground    p-2 pl-3 font-bold dark:text-black"
        />
        <button
          onClick={user.role==='student'?handleLoginStudent(user, setModalState, setLoadingFlag, setUser,navigate):handleLoginTeacher()}
          className="bg-primaryDark flex justify-center items-center  hover:bg-blue-700 text-white  font-bold py-2 px-4 rounded"
        >
          {loadingFlag?<LoadingSpinner/>:'Log in'}
        </button>
        <h1>forgot your password? <Link to='/recover-account'> <span className="p-2 rounded-lg text-primaryLightText dark:text-primaryDarkText dark:bg-primaryDarkBackground bg-primaryLightBackground hover:opacity-80" >recover account</span></Link></h1>
        <h1>already have an account? <Link to='/signup'> <span className="p-2 rounded-lg text-primaryLightText dark:text-primaryDarkText dark:bg-primaryDarkBackground bg-primaryLightBackground hover:opacity-80" >signup</span></Link></h1>

      </form>
    </article>
  );
};

export default Login;