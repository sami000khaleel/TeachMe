import React from "react";
import SearchForm from "../Navbar/SearchForm/SearchForm.jsx";
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookies'
import { LogIn,User, X } from "lucide-react";
import { Link } from "react-router-dom";
const DrawerMenu = ({user,modalState,setModalState,setCourses,theme,setDrawerMenuFlag}) => {
  const navigate=useNavigate()
  return (
    <span className="w-screen block sm:hidden z-50 h-auto   fixed top-0 -left-3 bg-white">
     <button onClick={()=>setDrawerMenuFlag(false)} className="fixed top-3 z-40 right-3" ><X size={40}  /></button>
      <ul className=" ml-3 flex shadow-xl px-4 w-screen bg-white  justify-start  flex-col items-start pt-10 absolute left-1/2 -translate-x-1/2 top-0   ">
        <li  className="py-5    w-full flex relative justify-start border-black items-center ">
       <div className="w-[300px]">
       <SearchForm
            modalState={modalState}
            setModalState={setModalState}
            setCourses={setCourses}
            />    </div>    </li>
        <li  className="py-5 mt-4  border-t  w-full flex justify-start border-black items-center ">
        {!user?._id ? (
            <Link to="/signup">
              <LogIn color={`${theme==='dark'?"white":'black'}`} cursor={"pointer"} />
            </Link>
          ) : (
            <Link to={`/user/${user._id}`} >
            <User color="black" cursor={"pointer"} />
            </Link>
          )}
        </li>
       
      </ul>
    </span>
  );
};

export default DrawerMenu;
