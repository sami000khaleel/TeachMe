import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useOutletContext } from "react-router-dom";
import api from "../../api/api";
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function CourseForm() {
  const { modalState, setModalState } = useOutletContext();
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [formData, setFormData] = useState({
    course_name: "",
    course_description: "",
    first_course: "",
    end_course: "",
    date1: { day: "", time: "" },
    date2: { day: "", time: "" },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData?.date1?.day ||
      !formData?.date2?.time ||
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
        setLoadingFlag(true)
        const { data } = await api.teacherAddCourse(
        formData.course_name,
        formData.course_description,
        formData.first_course,
        formData.end_course,
        formData.date1.day + " " + formData.date1.time,
        formData.date2.day + " " + formData.date2.time
      );
      setLoadingFlag(false)
      setModalState({
        message:'course was added successfully',
        status:200,
        errorFlag:false,
        hideFlag:false
      })
    } catch ({ response }) {
      console.log(err);
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
    if (!formData.first_course) return getMinDate();
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
    <div className="flex justify-center  items-center ">
      <form
        className="bg-white p-7 pt-1 rounded shadow-md mt-[80px] w-full dark:bg-black max-w-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-6">Create a Course</h1>
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
            value={formData.course_name}
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
            value={formData.course_description}
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
            selected={formData.first_course}
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
              value={formData.date1.day}
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
            <DatePicker
              selected={formData.date1.time}
              onChange={(date) => handleDayTimeChange("date1", "time", date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="hh:mm aa"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholderText="Select time"
            />
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
              value={formData.date2.day}
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
            <DatePicker
              selected={formData.date2.time}
              onChange={(date) => handleDayTimeChange("date2", "time", date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="hh:mm aa"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholderText="Select time"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default CourseForm;
