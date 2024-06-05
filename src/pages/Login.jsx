import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { userDataChange, handleLoginStudent, handleLoginTeacher } from "./utilities";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { modalState, setModalState, user, setUser } = useOutletContext();
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [teacherFlag,setTeacherFlag]=useState(false)
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <form
        className="mx-4 flex flex-col gap-5 shadow-xl w-full max-w-md p-8 bg-white dark:bg-black rounded-xl"
         
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Log in</h2>

        <div className="flex items-center mb-4">
          <label htmlFor="role" className="text-gray-700 text-sm font-bold dark:text-gray-300 mr-3">
            I am a teacher
          </label>
          <input
            type="checkbox"
            id="role"
            checked={teacherFlag}
            name="role"
            value="teacher"
            onChange={(e) => {
              setTeacherFlag(pre=>!pre)
            }}
            className="block bg-primaryLightBackground dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            value={user.email}
            onChange={userDataChange(setUser)}
            placeholder="Type in your email"
            name="email"
            id="email"
            className="block w-full bg-primaryLightBackground p-2 pl-3 font-bold dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            value={user.password}
            onChange={userDataChange(setUser)}
            placeholder="Type in your password"
            name="password"
            id="password"
            className="block w-full bg-primaryLightBackground p-2 pl-3 font-bold dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        <button
          onClick={ !teacherFlag
          ? handleLoginStudent(user, setModalState, setLoadingFlag, setUser, navigate)
          : handleLoginTeacher(user, setModalState, setLoadingFlag, setUser, navigate)}
          disabled={loadingFlag}
          className="bg-primaryDark flex justify-center items-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loadingFlag ? <LoadingSpinner /> : 'Log in'}
        </button>

        <h1 className="text-gray-700 dark:text-gray-300 mt-4">
          Forgot your password?
          <Link to="/recover-account">
            <span className="p-2 rounded-lg text-primaryLightText dark:text-primaryDarkText dark:bg-primaryDarkBackground bg-primaryLightBackground hover:opacity-80">
              Recover account
            </span>
          </Link>
        </h1>

        <h1 className="text-gray-700 dark:text-gray-300 mt-2">
          Do not have an account?
          <Link to="/signup">
            <span className="p-2 rounded-lg text-primaryLightText dark:text-primaryDarkText dark:bg-primaryDarkBackground bg-primaryLightBackground hover:opacity-80">
              Sign up
            </span>
          </Link>
        </h1>
      </form>
    </div>
  );
};

export default Login;
