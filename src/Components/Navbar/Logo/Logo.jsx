import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookies";
const Logo = ({ setFetchTrigger }) => {
  const navigate=useNavigate()
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation()
        setFetchTrigger(pre=>!pre)
        navigate('/home')
      }}
      className=""
    >
      <h1 className="text-3xl text-primaryDark">
        <span className="bg-primaryDark  text-[white] p-1 rounded-lg ">
          Teach
        </span>
        Me
      </h1>
    </button>
  );
};

export default Logo;
