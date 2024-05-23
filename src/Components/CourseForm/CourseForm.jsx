import React, { useState } from 'react';

function CourseForm() {
  const [formData, setFormData] = useState({
    course_name: '',
    course_description: '',
    first_course: '',
    end_course: '',
    date1: '',
    date2: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-lg" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-6">Kursinformationen eingeben</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="course_name">
            Kursname
          </label>
          <input
            type="text"
            id="course_name"
            name="course_name"
            value={formData.course_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="course_description">
            Kursbeschreibung
          </label>
          <input
            type="text"
            id="course_description"
            name="course_description"
            value={formData.course_description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_course">
            Beginn des Kurses
          </label>
          <input
            type="date"
            id="first_course"
            name="first_course"
            value={formData.first_course}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end_course">
            Ende des Kurses
          </label>
          <input
            type="date"
            id="end_course"
            name="end_course"
            value={formData.end_course}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date1">
            Datum 1
          </label>
          <input
            type="date"
            id="date1"
            name="date1"
            value={formData.date1}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date2">
            Datum 2
          </label>
          <input
            type="date"
            id="date2"
            name="date2"
            value={formData.date2}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Absenden
        </button>
      </form>
    </div>
  );
}

export default CourseForm;
