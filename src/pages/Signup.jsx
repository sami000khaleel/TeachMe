import React, { useState } from "react";
import ModalPopup from "../Components/ModalPopup/ModalPopup";
import { Link, useOutlet, useOutletContext } from "react-router-dom";
import { userDataChange, handleSignup } from "./utilties";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const { modaState, setModalState, user, setUser } = useOutletContext();
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [image,setImage]=useState()
  const navigate=useNavigate()
  return (
    <article className="flex justify-center items-center w-full h-screen" >

      <form className="mx-4 flex flex-col gap-5 shadow-xl w-full max-w-md p-8 bg-white dark:bg-black  rounded-xl">
        <h2 className="text-3xl font-bold  mb-4">Sign up</h2>
        <input
          type="text"
          value={user.name}
          onChange={userDataChange(setUser)}
          placeholder="Type in your name"
          name="name"
          id="name"
          className="block w-full bg-primaryLightBackground    p-2 pl-3 font-bold dark:text-black"
        />
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
     <label htmlFor="image" className="cursor-pointer block w-full bg-primaryLightBackground    p-2 pl-3 font-bold dark:text-[#919191]">
  Upload personal image
  <input
    type="file"
    id="image"
    accept="image/*"
    onChange={(e)=>setImage(e.target.files[0])}
    className="hidden cursor-pointer"
  />
</label>
        <button
          onClick={handleSignup(user, setModalState, setLoadingFlag, setUser,navigate)}
          className="bg-primaryDark flex justify-center items-center  hover:bg-blue-700 text-white  font-bold py-2 px-4 rounded"
        >
          {loadingFlag?<LoadingSpinner/>:'Submit'}
        </button>
        <h1>already have an account? <Link to='/login'> <span className="p-2 rounded-lg text-primaryLightText dark:text-primaryDarkText dark:bg-primaryDarkBackground bg-primaryLightBackground hover:opacity-80" >login</span></Link></h1>
      </form>
      </article>
  );
};

export default Signup;