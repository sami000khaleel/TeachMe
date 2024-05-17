import axios from "axios";
import Cookies from "js-cookies";

export default class api {
  static url = "http://127.0.0.1:3000/api";
  static async getCourseInfo(id_course) {
    const response = await axios.get(
      `${api.url}/course_info?id_course=${id_course}`
    );
  }
  static async resetPassword(password) {
    const response = await axios.patch(
      `${api.url}/student/reset-password`,
      password,
      {
        email: Cookies.getItem("email"),
        password: Cookies.getItem("password"),
      }
    );
    return response;
  }
  static async signup({ firstname, lastname, email, password, file }, image) {
    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("file", image);
    const response = await axios.post(
      `${api.url}/student/addstudent`,
      formData
    );
    return response;
  }
  static async loginStudent({ email, passwrod }) {
    const response = await axios.get(
      `${api.url}/student/reinsert?email=${email}`,
      {
        headers: {
          password,
        },
      }
    );
    return response;
  }
}
