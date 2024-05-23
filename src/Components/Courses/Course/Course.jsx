import React from 'react'
import { useNavigate } from 'react-router-dom'
const Course = ({course}) => {
    const navigate=useNavigate()
  return (
<div
  className="flex justify-between flex-col p-4 border gap-2 m-6 rounded-lg bg-white border-primaryDark dark:bg-black w-full sm:w-[calc(50%-3rem)] md:w-[calc(33.33%-3rem)] lg:w-[calc(25%-3rem)]"
  key={course.id_cours}
>
  <h1 className="text-xl font-bold mb-2">{course.cours_name}</h1>
  <h2 className="text-gray-500 mb-4">starts at: {course.first_cours.split('T')[0]}</h2>
  <p className="text-gray-700 dark:text-white mb-4">{course.cours_discription}</p>
  <button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      navigate(`/course/${course.id_cours}`);
    }}
    className="text-start w-full py-2 rounded-lg  text-primaryDark font-bold  hover:text-primaryDark"
  >
    See Details
  </button>
</div>)
}

export default Course