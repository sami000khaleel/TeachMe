import React, { useEffect, useState } from 'react';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../Components/LoadingSpinner/LoadingSpinner';
import { userDataChange, sendCode, verifyEmail } from './utilities';

const RecoverAccount = () => {
  const navigate = useNavigate();
  const [emailVerifiedFlag, setEmailVerifiedFlag] = useState(false);
  const [step, setStep] = useState(0);
  const [loadingFlag, setLoadingFlag] = useState(false);
  const { user, setUser, modalState, setModalState } = useOutletContext();

  useEffect(() => {
    setUser((prev) => ({ ...prev, role: 'student' }));
  }, []);

  return (
    <article className="flex justify-center items-center w-full h-screen">
      {!step ? (
        <form
          className="mx-4 flex flex-col gap-5 shadow-xl w-full max-w-md p-8 bg-white dark:bg-black rounded-xl"
          onSubmit={(e) => {
            e.preventDefault();
            verifyEmail(setEmailVerifiedFlag, user.email, user.role, setModalState, setLoadingFlag, setStep);
          }}
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">Verify your email</h2>

          <div className="flex items-center mb-4">
            <label htmlFor="role" className="text-gray-700 text-sm font-bold dark:text-gray-300 mr-3">
              I am a teacher
            </label>
            <input
              type="checkbox"
              id="role"
              checked={user?.role === 'teacher'}
              name="role"
              value="teacher"
              onChange={(e) => {
                setUser((prevUser) => ({ ...prevUser, role: e.target.checked ? 'teacher' : 'student' }));
              }}
              className="block bg-primaryLightBackground dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              onChange={userDataChange(setUser)}
              placeholder="Type in your email"
              name="email"
              id="email"
              className="block w-full bg-primaryLightBackground p-2 pl-3 font-bold dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          <button
            type="submit"
            disabled={loadingFlag}
            className="bg-primaryDark flex justify-center items-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {loadingFlag ? <LoadingSpinner /> : 'Verify email'}
          </button>

          <div className="flex justify-between items-center mt-4">
            <h1 className="text-gray-700 dark:text-gray-300">
              Already have an account?{' '}
              <Link to="/signup">
                <span className="p-2 rounded-lg text-primaryLightText dark:text-primaryDarkText dark:bg-primaryDarkBackground bg-primaryLightBackground hover:opacity-80">
                  Sign up
                </span>
              </Link>
            </h1>
            {emailVerifiedFlag && (
              <button
                onClick={() => setStep(1)}
                className="p-2 rounded-lg text-primaryLightText dark:text-primaryDarkText dark:bg-primaryDarkBackground bg-primaryLightBackground hover:opacity-80"
              >
                Next Step
              </button>
            )}
          </div>
        </form>
      ) : (
        <form
          className="mx-4 flex flex-col gap-5 shadow-xl w-full max-w-md p-8 bg-white dark:bg-black rounded-xl"
          onSubmit={(e) => {
            e.preventDefault();
            sendCode(user.code, navigate, setUser, setModalState, setLoadingFlag, setStep);
          }}
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">Insert your code</h2>

          <div className="mb-4">
            <label htmlFor="code" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
              Code
            </label>
            <input
              type="password"
              value={user.codetext}
              onChange={userDataChange(setUser)}
              placeholder="Type in the code you received"
              name="code"
              id="code"
              className="block w-full bg-primaryLightBackground p-2 pl-3 font-bold dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          <button
            type="submit"
            disabled={loadingFlag}
            className="bg-primaryDark flex justify-center items-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {loadingFlag ? <LoadingSpinner /> : 'Send code'}
          </button>

          <div className="flex justify-between items-center mt-4">
            <h1 className="text-gray-700 dark:text-gray-300">
              Already have an account?{' '}
              <Link to="/signup">
                <span className="p-2 rounded-lg text-primaryLightText dark:text-primaryDarkText dark:bg-primaryDarkBackground bg-primaryLightBackground hover:opacity-80">
                  Sign up
                </span>
              </Link>
            </h1>
            <button
              onClick={() => setStep(0)}
              className="p-2 rounded-lg text-primaryLightText dark:text-primaryDarkText dark:bg-primaryDarkBackground bg-primaryLightBackground hover:opacity-80"
            >
              Go back
            </button>
          </div>
        </form>
      )}
    </article>
  );
};

export default RecoverAccount;
