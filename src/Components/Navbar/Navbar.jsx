import React, { useState } from "react";
import Logo from "./Logo/Logo";
import SearchForm from "./SearchForm/SearchForm.jsx";
import { LogIn, LogOut, User } from "lucide-react";
const Navbar = ({user,modalState,setModalState,setCourses}) => {
  return (
    <header
      aria-label="header"
      className="text-primaryLight dark:text-primaryDark fixed  bg-primaryDarkBackground shadow-xl dark:bg-primaryLightBackground top-0 left-0 w-full "
    >
      <nav className="z-30 flex justify-between items-center py-4 px-5 "  >
        <Logo />
        <article className="flex items-center gap-5 flex-row center">
            {!user?._id?<LogIn color="black" cursor={'pointer'}/>:<User color="black" cursor={'pointer'} />}
        <SearchForm modalState={modalState} setModalState={setModalState} setCourses={setCourses}/>
        </article>
      </nav>
    </header>
  );
};

export default Navbar;
