import React, { useState } from "react";
import api from "../api/api";
import Cookies from "js-cookies";
import { useNavigate, useOutletContext } from "react-router-dom";
const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { modalState, setModalState } = useOutletContext();
  const [loadingFlag, setLoadingFlag] = useState(false);
  async function handleSubmitpassword(e) {
    e.preventDefault()
    try {
      setLoadingFlag(true);
      const { data } = await api.resetPassword(password);
      setLoadingFlag(false);
      setModalState({
        message: "password has been changed successfullt",
        status: 200,
        errorFlag: false,
        hideFlag: false,
      });
      navigate("/home");
    } catch (err) {
      setLoadingFlag(false);
      setModalState({
        message: err.response.data.message,
        status: err.response.status,
        errorFlag: true,
        hideFlag: false,
      });
    }
  }
  return (
    <form
      className="card shadow-xl border rounded-xl p-6 flex flex-col justify-center items-start gap-6"
      id="verify password"
    >
      <h1 className="text-3xl">type in your new password</h1>
      <input
        type="password"
        name="password"
        id="password"
        value={password}
        className="'border relative p-3   bg-[hsla(0,0%,97%,1)] "
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSubmitpassword}
        className="bg-black text-white p-3 rounded-lg hover:bg-gray-800"
      >
        {loadingFlag ? "loading" : "submit the password"}
      </button>
    </form>
  );
};

export default ResetPassword;
