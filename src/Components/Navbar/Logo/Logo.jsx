import React from "react";
import { Link } from "react-router-dom";
const Logo = () => {
  return (
    <Link  className="" to="/">
      <h1 className="text-3xl text-primaryDark">
        <span  className="bg-primaryDark text-[white] p-1 rounded-lg " >
        Teach
        </span>
       Me</h1>
    </Link>
  );
};

export default Logo;
