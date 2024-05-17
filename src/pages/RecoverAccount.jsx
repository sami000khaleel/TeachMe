import React,{useEffect, useState} from 'react'
import { useOutletContext,Link,useNavigate } from 'react-router-dom'
import LoadingSpinner from '../Components/LoadingSpinner/LoadingSpinner'
import { userDataChange,sendCode,sendEmail } from './utilties'
const RecoverAccount = () => {
  const navigate=useNavigate()
  const [emailVerifiedFlag,setEmailVerifiedFlag]=useState(false)
  const [step,setStep]=useState(0)
  const [loadingFlag,setLoadingFlag]=useState(false)
  const {user,setUser,modalState,setModalState}=useOutletContext()
  return (
    <article className="flex justify-center items-center w-full h-screen" >

    {!step?<form className="mx-4 flex flex-col gap-5 shadow-xl w-full max-w-md p-8 bg-white dark:bg-black  rounded-xl">
        <h2 className="text-3xl font-bold  mb-4">verify your email</h2>
        <input
          type="email"
          value={user.email}
          onChange={userDataChange(setUser)}
          placeholder="Type in your email"
          name="email"
          id="email"
          className="block w-full bg-primaryLightBackground    p-2 pl-3 font-bold dark:text-black"
        />
                <button
          onClick={sendEmail(setEmailVerifiedFlag,user.email,setModalState,setLoadingFlag,setStep)}
          className="bg-primaryDark flex justify-center items-center  hover:bg-blue-700 text-white  font-bold py-2 px-4 rounded"
          >
          {loadingFlag?<LoadingSpinner/>:'verify email'}
        </button>
        <span className='flex flex-wrap justify-between items-center flex-row'>

<h1>already have an account? <Link to='/signup'> <span className="p-2 rounded-lg text-primaryLightText dark:text-primaryDarkText dark:bg-primaryDarkBackground bg-primaryLightBackground hover:opacity-80" >signup</span></Link></h1>
{emailVerifiedFlag?<button onClick={(e)=>setStep(1)}  className="p-2 rounded-lg text-primaryLightText dark:text-primaryDarkText dark:bg-primaryDarkBackground bg-primaryLightBackground hover:opacity-80" >go back</button>:null}
</span>
          </form>:
          <form className="mx-4 flex flex-col gap-5 shadow-xl w-full max-w-md p-8 bg-white dark:bg-black  rounded-xl">
          <h2 className="text-3xl font-bold  mb-4">insert your code</h2>

        <input
          type="password"
          value={user.codetext}
          onChange={userDataChange(setUser)}
          placeholder="type in the code you recieved"
          name="code"
          id="code"
          className="block w-full bg-primaryLightBackground    p-2 pl-3 font-bold dark:text-black"
        />
        <button
          onClick={sendCode(user.code,setUser,setLoadingFlag,setStep)}
          className="bg-primaryDark flex justify-center items-center  hover:bg-blue-700 text-white  font-bold py-2 px-4 rounded"
          >
          {loadingFlag?<LoadingSpinner/>:'send code'}
        </button>
        <span className='flex flex-wrap justify-between items-center flex-row'>

        <h1>already have an account? <Link to='/'> <span className="p-2 rounded-lg text-primaryLightText dark:text-primaryDarkText dark:bg-primaryDarkBackground bg-primaryLightBackground hover:opacity-80" >signup</span></Link></h1>
        <button onClick={(e)=>setStep(0)}  className="p-2 rounded-lg text-primaryLightText dark:text-primaryDarkText dark:bg-primaryDarkBackground bg-primaryLightBackground hover:opacity-80" >go back</button>
        </span>
          </form>}
</article>
  
  )
}

export default RecoverAccount