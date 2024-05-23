import React, { useEffect,useState } from 'react'
import CourseForm from '../Components/CourseForm/CourseForm'
import { useOutletContext } from 'react-router-dom'
const User = () => {

  const [loadingFlag,setLoadingFlag]=useState(false)
const {user,setModalState}=useOutletContext()  
useEffect(()=>{
  // fetch the teachers courses
  console.log('a')
},[])  
return (
    <section id='uesrs page' className='w-full h-full dark:bg-black' >
      <CourseForm/>
    </section>
  )
}

export default User