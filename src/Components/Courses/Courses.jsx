import React from 'react'
import Course from './Course/Course'
const Courses = ({courses,teachersCourseFlag,setSelectedCourse,setUpdateMode}) => {
  return (
    <article className="w-full flex flex-wrap justify-center">
    {courses.map((course) => (
      <Course setUpdateMode={setUpdateMode}  setSelectedCourse={setSelectedCourse} key={course.id_cours} course={course} />
    ))}
  </article>  )
}

export default Courses