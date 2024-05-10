import Cookies from "js-cookies";
import api from "../api/api";
export const userDataChange = (setUser) => (e) => {
  setUser((pre) => ({ ...pre, [e.target.name]: e.target.value }));
};
export const handleSignup =
  (user, setUser, setModalState, setLoadingFlag) => async (e) => {
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
