import React, { useState, useEffect } from "react";
import Success from "../../assets/Svgs/Success";
import Error from "../../assets/Svgs/Error";
import "./loaderAnimation.css";

const ModalPopup = ({ modalState, setModalState }) => {
  const [timerFlag, setTimerFlag] = useState(false);
  const [timeOutId, setTimeOutId] = useState(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setModalState((prevState) => ({
        ...prevState,
        hideFlag: true,
      }));
    }, 2000);
    setTimeOutId(id);
  }, []);
  function handleCloseModal(e) {
    e.preventDefault();
    setModalState((prevState) => ({
      ...prevState,
      hideFlag: true,
    }));
    clearTimeout(timeOutId);
  }

  return (
    <article
      className={` fade-out ${
        modalState?.errorFlag ? "text-red-600" : "text-[#25F433]"
      } rounded-2xl overflow-hidden bg-white shadow-2xl mt-3  flex flex-col items-center gap-6 justify-start max-w-[250px] min-w-[200px]   p-7    text-red-600 z-[99999] fixed top-0 left-1/2 -translate-x-1/2 `}
    >
      {modalState?.errorFlag ? <Error /> : <Success />}
      <h1
        className={`${
          modalState?.errorFlag ? "text-red-600" : "text-[#25F433]"
        } text-3xl`}
      >
        {modalState?.errorFlag ? "Error" : "Success"}
      </h1>
      <h3 className="text-black">{modalState?.message}</h3>
      <button
        className={`${
          modalState?.errorFlag ? "bg-red-600" : "bg-[#25F433]"
        } text-white p-3 rounded-lg `}
        onClick={handleCloseModal}
      >
        {!modalState?.errorFlag ? <p>OK</p> : <p>Cancel</p>}
      </button>
      <span
        id="loader"
        className={`${
          !modalState.hideFlag ? "animate-loader" : ""
        } absolute left-0 bottom-0 h-[10px] ${
          modalState?.errorFlag ? "bg-red-600" : "bg-[#25F433]"
        }
       `}
      ></span>
    </article>
  );
};

export default ModalPopup;
