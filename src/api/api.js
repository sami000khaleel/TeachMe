import axios from "axios";
import Cookies from "js-cookies";

export default class api {
  static url = "http://127.0.0.1:3000/api";
  static async getCourseInfo(id_course) {
    const response = await axios.get(
      `${api.url}/course_info?id_course=${id_course}`
    );
  }
  static async resetPassword(password,role) {
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await axios.patch(
      `${api.url}/student/reset_password`,{password,role:user.role},

      {
        headers: {
          password: user.password,
          email: user.email,
        },
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
  static async loginStudent({ email, password }) {
    console.log(password);
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
  static async loginTeacher({ email, password }) {
    const response = await axios.get(`${api.url}/teacher/insert_teacher`, {
      headers: {
        email,
        password,
      },
    });
    return response;
  }
  static async verifyEmail(email, role) {
    const response = await axios.get(
      `${api.url}/student/send_code?email=${email}&role=${role}`
    );
    return response;
  }
  static async sendCode(code) {
    const response = await axios.get(
      `${api.url}/student/verify_code?code=${code}`
    );
    return response;
  }
}
