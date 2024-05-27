import React, { useState, useEffect } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";
import { userDataChange, handleResetPassword } from "./utilities";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";

const ResetPassword = () => {
  const { modalState, setModalState, user, setUser } = useOutletContext();
  const [loadingFlag, setLoadingFlag] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUser((prev) => ({ ...prev, password: "" }));
  }, []);

  return (
    <article className="flex justify-center items-center w-full h-screen">
      <form className="mx-4 flex flex-col gap-5 shadow-xl w-full max-w-md p-8 bg-white dark:bg-black rounded-xl">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Reset your password
        </h2>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
          >
            New Password
          </label>
          <input
            type="password"
            value={user.password}
            onChange={userDataChange(setUser)}
            placeholder="Type in your new password"
            name="password"
            id="password"
            className="block w-full bg-primaryLightBackground p-2 pl-3 font-bold dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        <button
          onClick={handleResetPassword(
            user.password,
            user.role,
            setUser,
            navigate,
            setLoadingFlag,
            setModalState
          )}
          disabled={loadingFlag}
          className="bg-primaryDark flex justify-center items-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loadingFlag ? <LoadingSpinner /> : "Reset"}
        </button>
      </form>
    </article>
  );
};

export default ResetPassword;
