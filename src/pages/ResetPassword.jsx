import React, { useState } from "react";
import ModalPopup from "../Components/ModalPopup/ModalPopup";
import { Link, useOutlet, useOutletContext } from "react-router-dom";
import { userDataChange, handleResetPassword } from "./utilties";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";
import { useNavigate } from "react-router-dom";
const ResetPassword = () => {
  const { modaState, setModalState, user, setUser } = useOutletContext();
  const [loadingFlag, setLoadingFlag] = useState(false);
  const navigate=useNavigate()
  return (
    <article className="flex justify-center items-center w-full h-screen" >

      <form className="mx-4 flex flex-col gap-5 shadow-xl w-full max-w-md p-8 bg-white dark:bg-black  rounded-xl">
        <h2 className="text-3xl font-bold  mb-4">reset your password</h2>
        <input
          type="password"
          value={user.password}
          onChange={userDataChange(setUser)}
          placeholder="Type in your new password"
          name="password"
          id="password"
          className="block w-full bg-primaryLightBackground    p-2 pl-3 font-bold dark:text-black"
        />
        <button
          onClick={handleResetPassword(user, setModalState, setLoadingFlag, setUser,navigate)}
          className="bg-primaryDark flex justify-center items-center  hover:bg-blue-700 text-white  font-bold py-2 px-4 rounded"
        >
          {loadingFlag?<LoadingSpinner/>:'reset'}
        </button>

      </form>
      </article>
  );
};

export default ResetPassword;