import React, { useState,useEffect } from "react";
import Logo from "./Logo/Logo";
import SearchForm from "./SearchForm/SearchForm.jsx";
import DrawerMenu from "../DrawerMenu/DrawerMenu.jsx";
import { handleThemeChange } from "../../App.js";
import { Link,useLocation } from "react-router-dom";
import { LogIn, LogOut, Menu, User } from "lucide-react";
const Navbar = ({ theme,setTheme,user, modalState, setModalState, setCourses }) => {
  const [drawerMenuFlag,setDrawerMenuFlag]=useState(false)
  const location=useLocation()
  useEffect(()=>setDrawerMenuFlag(false),[location.pathname])
  return (
    <header
      aria-label="header"
      className="  text-primaryDark sticky top-0 left-0  z-[99999] white shadow-xl dark:bg-black  w-full"
    >
      <nav className="z-[99999] flex justify-between items-center py-4 px-5 ">
       <span className="flex items-center gap-5 justify-center" >
        <Logo />
        <button  onClickCapture={handleThemeChange(setTheme)} className="p-2 rounded-lg dark:text-primaryDarkText  bg-primaryDark dark:bg-primaryDarkBackground text-white  " >{theme}</button>
       </span>
        <article className="flex items-center gap-5 flex-row center relative ">
        
         <button onClick={(e)=>setDrawerMenuFlag(pre=>!pre)} className="sm:hidden" >
         <Menu/>
         </button>
         {drawerMenuFlag?<DrawerMenu setDrawerMenuFlag={setDrawerMenuFlag} theme={theme} user={user} modalState={modalState} setModalState={setModalState}  setCourses={setCourses} />:null}
         <div className="sm:flex flex-row gap-5 items-center hidden ">
          {!JSON.parse(localStorage.getItem('user'))?.id? (
            <Link to="/signup">
              <LogIn color={`${theme==='dark'?"white":'black'}`} cursor={"pointer"} />
            </Link>
          ) : (
            <Link to={`/user/${user.id}`} >
            <User color={`${theme==='dark'?"white":'black'}`} cursor={"pointer"} />
            </Link>
          )}
          <SearchForm
            modalState={modalState}
            setModalState={setModalState}
            setCourses={setCourses}
            />
            </div>
        </article>
      </nav>
      
    </header>
  );
};

export default Navbar;
