import React from 'react'
import Course from './Course/Course'
const Courses = ({courses}) => {
  return (
    <article className="w-full flex flex-wrap justify-center">
    {courses.map((course) => (
      <Course key={course.id_cours} course={course} />
    ))}
  </article>  )
}

export default Courses