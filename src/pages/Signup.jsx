import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { userDataChange, handleSignup } from "./utilities";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { modalState, setModalState, user, setUser } = useOutletContext();
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  return (
    // <div className="w-full h-full mx-auto">

    <div className="flex justify-center items-center min-h-screen mx-auto ">
      <form
        className="mx-4 flex flex-col justify-between  items-center gap-4 shadow-xl w-full max-w-[600px] min-w-[320px] p-8 bg-white dark:bg-black rounded-xl"
        
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Sign up</h2>
        <div className="flex sm:flex-row flex-col justify-between gap-5   items-start">
        <div className="flex flex-col justify-center gap-6 items-center">
        <div className="">
          <label htmlFor="firstname" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
            First Name
          </label>
          <input
            type="text"
            value={user.firstname}
            onChange={userDataChange(setUser)}
            placeholder="Type in your firstname"
            name="firstname"
            id="firstname"
            className="block w-full bg-primaryLightBackground p-2 pl-3 font-bold dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        <div className="">
          <label htmlFor="lastname" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
            Last Name
          </label>
          <input
            type="text"
            value={user.lastname}
            onChange={userDataChange(setUser)}
            placeholder="Type in your lastname"
            name="lastname"
            id="lastname"
            className="block w-full bg-primaryLightBackground p-2 pl-3 font-bold dark:bg-gray-700 dark:text-gray-200"
            />
        </div>

        <div className="">
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
            </div>
            <div className="flex flex-col gap-5 justify-center items-center">

        <div className="w-full">
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

        <div className="w-full">
          <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
            Personal Image
          </label>
          <label
            htmlFor="image"
            className="cursor-pointer block w-full bg-primaryLightBackground p-2 pl-3 font-bold dark:bg-gray-700 dark:text-gray-300"
          >
            {image?.name ? image.name : 'Upload personal image'}
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden cursor-pointer w-full"
            />
          </label>
        </div>

        <button
  onClick={handleSignup(user, image, setModalState, setLoadingFlag, setUser, navigate)}
disabled={loadingFlag}
          className="bg-primaryDark flex justify-center items-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loadingFlag ? <LoadingSpinner /> : 'Submit'}
        </button>

        <h1 className="text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login">
            <span className="p-2 rounded-lg text-primaryLightText dark:text-primaryDarkText dark:bg-primaryDarkBackground bg-primaryLightBackground hover:opacity-80">
              Login
            </span>
          </Link>
        </h1>
              </div>
</div>
      </form>
    </div>
              // </div>
  );
};

export default Signup;
