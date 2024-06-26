import axios from "axios";
import Cookies from "js-cookies";

export default class api {
  static url = `/api`;
  static async getCourseInfo(id_course) {
    const response = await axios.get(
      `${api.url}/course_info?id_course=${id_course}`
    );
  }
  static async resetPassword(password, role) {
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await axios.patch(
      `${api.url}/student/reset_password`,
      { password, role: user.role },

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
  static async getRandomCourses() {
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await axios.get(`${api.url}/student/get_courses`);
    return response;
  }
  static async getStudentCourses(studentId) {
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await axios.get(
      `${api.url}/student/get_my_courses?id=${user.id}`,
      {
        headers: {
          email: user.email,
          password: user.password,
        },
      }
    );
    return response;
  }

  static async getCourseInfo(courseId) {
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await axios.get(
      `${api.url}/student/course_info?id_course=${courseId}`
    );

    return response;
  }
  static async enrollStudent(courseId) {
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await axios.post(
      `${api.url}/student/login_course`,
      {
        id_course: courseId,
        id_student: user.id,
      },
      {
        headers: {
          password: user.password,
          email: user.email,
        },
      }
    );
    console.log(response);
    return response;
  }
  static async searchCourses(query) {
    const response = await axios.get(
      `${api.url}/student/searchcourse_bycoursename?course_name=${query}`
    );
    return response;
  }
  static async teacherAddCourse(
    course_name,
    course_discription,
    first_course,
    end_course,
    date1,
    date2
  ) {
    console.log(date1);
    const user = JSON.parse(localStorage.getItem("user"));

    const response = await axios.post(
      `${api.url}/teacher/add_course`,
      {
        course_name,
        course_discription,
        first_course,
        end_course,
        date1,
        date2,
      },
      {
        headers: {
          email: user.email,
          password: user.password,
        },
      }
    );
    console.log(response);
    return response;
  }
  static async getTeachersCourses() {
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user?.id)
        return
    const response = await axios.get(
      `${api.url}/teacher/get_courses?id_teacher=${user.id}`,
      {
        headers: {
          email: user.email,
          password: user.password,
        },
      }
    );
    return response;
  }
  static async getTeachersCourseInfo(courseId) {
    const user = JSON.parse(localStorage.getItem("user"));

    const response = await axios.get(
      `${api.url}/teacher/get-course-info?id=${user.id}&course_id=${courseId}`,
      {
        headers: {
          email: user.email,
          password: user.password,
        },
      }
    );
    return response;
  }
  static async getStudentImage(imageUrl){
    const response=await axios.get(imageUrl)
    return response
  }
  static async deleteCourse(userId,courseId){
    const user = JSON.parse(localStorage.getItem("user"));
    await axios.delete(`${api.url}/teacher/delete_course?id_course=${courseId}&id=${userId}`,{
      headers:{
        email:user.email,
        password:user.password
      }
    })
  }
  static async updateCourse(formData){
    console.log(formData)
    const user=JSON.parse(localStorage.getItem('user'))
    formData.id_teacher=user.id
    formData.date1=formData.date1.day+" "+formData.date1.time
    formData.date2=formData.date2.day+" "+formData.date2.time
    formData.first_course=formData.first_course.toString()
    .slice(0, 19)
    .replace("T", " ")
    .split(" ")[0]
    formData.end_course=formData.end_course.toString()
    .slice(0, 19)
    .replace("T", " ")
    .split(" ")[0]
    const response=await axios.patch(`${api.url}/teacher/update_date`,{... formData},{
      headers:{
        email:user.email,
        password:user.password
      }
    })
    return response
  } 
}
