import Cookies from "js-cookies";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export const userDataChange = (setUser) => (e) => {
  setUser((pre) => ({ ...pre, [e.target.name]: e.target.value }));
};
export const handleSignup =
  (user, image, setModalState, setLoadingFlag, setUser, navigate) =>
  async (e) => {
    e.preventDefault();
    if (!image?.name)
      return setModalState({
        message: "you must upload an image of your self",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    if (!user?.email)
      return setModalState({
        message: "you missed the email",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    if (!user?.firstname)
      return setModalState({
        message: "you missed the firstname",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    if (!user?.lastname)
      return setModalState({
        message: "you missed the lastname",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    if (!user?.password)
      return setModalState({
        message: "you missed the password",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    //signup code
    try {
      setLoadingFlag(true);
      const { data } = await api.signup(user, image);
      setUser({ ...data,role:'student',code:'' });
      localStorage.setItem("user", JSON.stringify({...data,role:'student'}));
      setLoadingFlag(false);
      navigate("/");
    } catch (err) {
      console.log(err);
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
export const handleLoginStudent =
  (user, setModalState, setLoadingFlag, setUser, navigate) => async (e) => {
    e.preventDefault();
    if (!user?.email)
      return setModalState({
        message: "you need to fill out all the email",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    if (!user?.password)
      return setModalState({
        message: "you need to fill out all the email",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    try {
      setLoadingFlag(true);
      const { data } = await api.loginStudent(user);
      console.log(data)
      const newUser = {
        id: data.id_stu,
        firstname: data.first_name_stu,
        lastname: data.last_name_stu,
        password:data.password,
        email: data.email_stu,
        imageUrl: data.image_url,
        code:'',
        role:'student'
      };
      setUser(newUser);
      localStorage.setItem('user',JSON.stringify(newUser))
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
export const handleLoginTeacher =
  (user, setModalState, setLoadingFlag, setUser, navigate) => async (e) => {
    e.preventDefault();
    if (!user?.email)
      return setModalState({
        message: "you need to fill out all the email",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    if (!user?.password)
      return setModalState({
        message: "you need to fill out all the email",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    try {
      setLoadingFlag(true);
      const { data } = await api.loginTeacher(user);
      console.log(data)
      const newUser = {
        id: data.id_teacher,
        firstname: data.first_name,
        lastname: data.last_name,
        password:data.password,
        email: data.email,
        code:'',
        role:'teacher'
      };
      setUser(newUser);
      localStorage.setItem('user',JSON.stringify(newUser))
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
  (code,navigate, setUser, setModalState, setLoadingFlag, setStep) => async (e) => {
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
      const { data } = await api.sendCode(code);
      const newUser = {
        id: data.id_stu,
        firstname: data.first_name_stu,
        lastname: data.last_name_stu,
        password:data.password,
        email: data.email_stu,
        imageUrl: data.image_url,
        code:'',
        role:'student'
      };
      setUser(newUser);
      localStorage.setItem('user',JSON.stringify(newUser))
      setLoadingFlag(false);
      setStep(0);
      navigate("/reset-password");
    } catch (err) {
      console.log(err);
      setLoadingFlag(false);
      setModalState({ message: "code is not correct !",hideFlag:false,status:400,errorFlag:true });
    }
  };
// handle cookies
export const verifyEmail =
  (setEmailVerifiedFlag, email,role, setModalState, setLoadingFlag, setStep) =>
  async (e) => {
    e.preventDefault();
    if (!email)
      return setModalState({
        message: "you need to fill out the email field",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    try {
      setLoadingFlag(true);
      const { data } = await api.verifyEmail(email,role);
      setLoadingFlag(false);
      setModalState({
        message: "email sent code you be sent to you immediately !",
        status: 200,
        errorFlag: false,
        hideFlag: false,
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
export const handleResetPassword =
  (password,role, setUser, navigate, setLoadingFlag, setModalState) => async (e) => {
    try {
      e.preventDefault()
      console.log('adsa')
      let user=JSON.parse(localStorage.getItem('user'))
      if (!user.email || !user.password)
        return setModalState({
      message: "you have to be registered first",
      status: 400,
      errorFlag: true,
      hideFlag: false,
    });
      if (!password)
        return setModalState({
          message: "write the new password",
          status: 400,
          errorFlag: true,
          hideFlag: false,
        });
      setLoadingFlag(true);
      const { data } = await api.resetPassword(password);
      // handle cookies
      let newUser=JSON.parse(localStorage.getItem('user'))
      newUser.password=password
      localStorage.setItem('user',JSON.stringify(newUser))
      setLoadingFlag(false);
      navigate("/");
    } catch (err) {
      console.log(err);
      setModalState({
        message: "error resetting this password",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    }
  };
