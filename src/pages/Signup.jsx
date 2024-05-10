import React,{useState} from "react";
import ModalPopup from "../Components/ModalPopup/ModalPopup";
import { Link, useOutlet, useOutletContext } from "react-router-dom";
import { userDataChange,handleSignup } from "./utilties";
const Signup = () => {
  const { modaState, setModalState, user, setUser }=useOutletContext()
 const [loadingFlag,setLoadingFlag]=useState(false)
  return (
    <form className=" bg-white dark:bg-black">
      <input
        type="text"
        value={user.name}
        onChange={userDataChange(setUser)}
        placeholder="type in your name"
        name="name"
        id="name"
      />
      <input
        type="email"
        value={user.email}
        onChange={userDataChange(setUser)}
        placeholder="type in your email"
        name="email"
        id="email"
      />
      <input
        type="password"
        value={user.password}
        onChange={userDataChange(setUser)}
        placeholder="type in your password"
        name="password"
        id="password"
      />
      <button onClick={handleSignup(user,setModalState,setLoadingFlag,setUser)} className="">submit</button>
    </form>
  );
};

export default Signup;
