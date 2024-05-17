import Cookies from "js-cookies";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export const userDataChange = (setUser) => (e) => {
  setUser((pre) => ({ ...pre, [e.target.name]: e.target.value }));
};
export const handleSignup =
  (user, setModalState, setLoadingFlag, setUser, navigate) => async (e) => {
    e.preventDefault();
    if (Object.keys(user).some((field) => !user[field]))
      return setModalState({
        message: "you need to fill out all the fields",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    //signup code
    try {
      setLoadingFlag(true);
      const { data } = await api.signup(user);
      setUser(data.user);
      Cookies.setItem("user", data.user);
      setLoadingFlag(false);
      navigate("/");
    } catch (err) {
      setLoadingFlag(false);
      setModalState({
        message: "error while signing up.",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    }
  };
// handle cookies
export const handleLogin =
  (user, setModalState, setLoadingFlag, setUser, navigate) => async (e) => {
    e.preventDefault();
    if (Object.keys(user).some((field) => !user[field]))
      return setModalState({
        message: "you need to fill out all the fields",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    try {
      setLoadingFlag(true);
      const { data } = await api.login(user);
      setUser(data.user);
      Cookies.setItem("user", data.user);
      setLoadingFlag(false);
      navigate("/");
    } catch (err) {
      console.log(err);
      setLoadingFlag(false);
      setModalState({
        message: "one or both of the fields are wrong",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    }
  };
// handle cookies
export const sendCode =
  (code, setUser, setModalState, setLoadingFlag, setStep) => async (e) => {
    try {
      if (!code)
        return setModalState({
          message: "you need to type in the code",
          status: 400,
          errorFlag: true,
          hideFlag: false,
        });
      e.preventDefault();
      setLoadingFlag(true);
      const { data } = await api.sendCode(user.code);
      setUser(data.user);
      // Cookies.setItem('email',data.user.emai)
      setLoadingFlag(false);
      setStep(0);
      navigate("/reset-password");
    } catch (err) {
      console.log(err);
      setLoadingFlag(false);
      setModalState({ message: "code is not correct !" });
    }
  };
// handle cookies
export const sendEmail =
  (setEmailVerifiedFlag, email, setModalState, setLoadingFlag, setStep) =>
  async (e) => {
    e.preventDefault();
    if(!email)
    return setModalState({
      message: "you need to fill out all the fields",
      status: 400,
      errorFlag: true,
      hideFlag: false,
    });
    try {
      setLoadingFlag(true);
      const { data } = await api.sendEmail(email);
      setLoadingFlag(false);
      setModalState({
        message: "email sent code you be sent to you immediately !",
        status: 200,
        errorFlag: false,
        hideFlag: true,
      });
      setStep(1);
      setEmailVerifiedFlag(true);
    } catch (err) {
      console.log(err);
      setLoadingFlag(false);
      setModalState({
        message: "this email does not exist",
        status: 404,
        errorFlag: true,
        hideFlag: false,
      });
    }
  };
// handle cookies
export const  handleResetPassword=(
  password,
  setUser,
  navigate,
  setLoadingFlag,
  setModalState
) =>async (e) => {
    try {
      if(!password)
        return setModalState({
          message: "write the new password",
          status: 400,
          errorFlag: true,
          hideFlag: false,
        });
      setLoadingFlag(true);
      const { data } = await api.resetPassword(password);
      setUser(data.user);
      // handle cookies
      setLoadingFlag(false);
      navigate("/");
    } catch (error) {
      console.log(err);
      setModalState({
        message: "error resetting this password",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    }
  };

