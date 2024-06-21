import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useOutletContext } from "react-router-dom";
import api from "../../api/api";
import { updateCourse } from "../../App";
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const formatHours = () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? "AM" : "PM";
    hours.push(`${hour}:00 ${period}`);
  }
  return hours;
};

const hours = formatHours();

function CourseForm({
  setTeachersCourses,
  selectedCourse,
  setSelectedCourse,
  updateMode,
  setUpdateMode,
}) {
  const [course, setCourse] = useState({});
  const { modalState, setModalState, setCourses, courses } = useOutletContext();
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [formData, setFormData] = useState({
    course_name: "",
    course_description: "",
    first_course: "",
    end_course: "",
    date1: { day: "", time: "" },
    date2: { day: "", time: "" },
  });
  useEffect(() => {
    if (!updateMode) {
      setFormData({})
      return
    }
    if (!selectedCourse?.id_cours) return;
    let date1 = selectedCourse.date1.split(" ");
    let date2 = selectedCourse.date2.split(" ");
    console.log(date1);
    let user = JSON.parse(localStorage.getItem("user"));
    let obj = {};
    obj.date1 = { day: date1[0], time: date1[1] + " " + date1[2] };
    obj.date2 = { day: date2[0], time: date2[1] + " " + date2[2] };
    console.log(obj);
    obj.course_name = selectedCourse.cours_name;
    obj.first_course = selectedCourse.first_cours;
    obj.end_course = selectedCourse.end_cours;
    obj.course_description = selectedCourse.cours_discription;
    obj.id_course = selectedCourse.id_cours;
    obj.id_teacher = user;
    setFormData(obj);
  }, [updateMode]);
  console.log(formData);
  // console.log(selectedCourse)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData?.date1?.day ||
      !formData?.date1?.time ||
      !formData?.date2?.day ||
      !formData?.date2?.time ||
      !formData?.first_course ||
      !formData?.end_course ||
      !formData?.course_name ||
      !formData?.course_description
    )
      return setModalState({
        message: "you need to fill in all of the fields correctly",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    try {
      setLoadingFlag(true);
      const { data } = await api.teacherAddCourse(
        formData.course_name,
        formData.course_description,
        new Date(formData.first_course)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        new Date(formData.end_course)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        formData.date1.day + " " + formData.date1.time,
        formData.date2.day + " " + formData.date2.time
      );
      setFormData({})
      const obj = {
        cours_name: formData.course_name,
        course_description: formData.course_description,
        first_cours: new Date(formData.first_course)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")
          .split(" ")[0],
        end_cours: new Date(formData.end_course)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")
          .split(" ")[0],
        date1: formData.date1.day + " " + formData.date1.time,
        date2: formData.date2.day + " " + formData.date2.time,
      };
      // window.location.reload()
      setLoadingFlag(false);
      setModalState({
        message: "course was added successfully",
        status: 200,
        errorFlag: false,
        hideFlag: false,
      });
      obj.id_cours = data;
      setCourses((pre) => [...pre, obj]);
      setTeachersCourses((pre) => [...pre, obj]);
    } catch (err) {
      console.log(err, "hello");
      setLoadingFlag(false);
      setModalState({
        message: "error posting the course",
        status: 400,
        errorFlag: true,
        hideFlag: false,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleDayTimeChange = (name, type, value) => {
    setFormData({
      ...formData,
      [name]: {
        ...formData[name],
        [type]: value,
      },
    });
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    return today;
  };

  const getMinEndDate = () => {
    if (!formData.first_course)  {
      const now = new Date();
      now.setMonth(now.getMonth() + 1);
      now.setDate(now.getDate() + 7);
      return now;
    }
          const startDate = new Date(formData.first_course);
    startDate.setMonth(startDate.getMonth() + 1);
    return startDate;
  };

  const getMaxStartDate = () => {
    if (!formData.end_course) return null;
    const endDate = new Date(formData.end_course);
    endDate.setMonth(endDate.getMonth() - 1);
    return endDate;
  };

  return (
    <div className="flex justify-center w-full items-center">
      <form
        className="bg-white p-7 pt-1 rounded shadow-md mt-[80px] w-full dark:bg-black max-w-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-6">
          {updateMode ? "update the course" : "Create a Course"}
        </h1>
        <div className="mb-4">
          <label
            className="block text-gray-800 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="course_name"
          >
            Course Name
          </label>
          <input
            type="text"
            id="course_name"
            name="course_name"
            value={formData?.course_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-800 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="course_description"
          >
            Course Description
          </label>
          <input
            type="text"
            id="course_description"
            name="course_description"
            value={formData?.course_description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-800 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="first_course"
          >
            Starts At:
          </label>
          <DatePicker
            selected={formData?.first_course}
            onChange={(date) => handleDateChange("first_course", date)}
            minDate={getMinDate()}
            maxDate={getMaxStartDate()}
            dateFormat="yyyy-MM-dd"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholderText="Select start date"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-800 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="end_course"
          >
            Ends At:
          </label>
          <DatePicker
            selected={formData.end_course}
            onChange={(date) => handleDateChange("end_course", date)}
            minDate={getMinEndDate()}
            dateFormat="yyyy-MM-dd"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholderText="Select end date"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-800 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="date1"
          >
            Every Week At (Day and Time):
          </label>
          <div className="flex gap-2">
            <select
              value={formData.date1?.day}
              onChange={(e) =>
                handleDayTimeChange("date1", "day", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="" disabled>
                Select day
              </option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <select
              value={formData.date1?.time}
              onChange={(e) =>
                handleDayTimeChange("date1", "time", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="" disabled>
                Select time
              </option>
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-800 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="date2"
          >
            Every Week At (Day and Time):
          </label>
          <div className="flex gap-2">
            <select
              value={formData.date2?.day}
              onChange={(e) =>
                handleDayTimeChange("date2", "day", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="" disabled>
                Select day
              </option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <select
              value={formData?.date2?.time}
              onChange={(e) =>
                handleDayTimeChange("date2", "time", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="" disabled>
                Select time
              </option>
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>
        </div>
        {!updateMode ? (
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={updateCourse(
              formData,
              setLoadingFlag,
              setModalState,
              setTeachersCourses,
              setUpdateMode
            )}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            update
          </button>
        )}
        {updateMode?<button onClick={(e)=>{
          e.preventDefault()
          e.stopPropagation()
          setUpdateMode(false)
          setSelectedCourse({})
        }} className="w-full text-blue-500  border-2 border-blue-500 dark:border-none bg-white  py-2 px-4 rounded-md hover:bg-blue-500 mt-2 hover:text-white font-bold transition duration-300">
          forget it 
        </button>:null}
      </form>
    </div>
  );
}

export default CourseForm;
