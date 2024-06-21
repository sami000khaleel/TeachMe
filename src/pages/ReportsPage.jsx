import React, { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";
import Reports from "../Components/Reports.jsx/Reports";

const ReportsPage = () => {
  const { courseId } = useParams();
  const [hasRequestedReports, setHasRequestedReports] = useState(false);
  const { setModalState, modalState, user } = useOutletContext();
  const [todaysReports, setTodaysReports] = useState([]);
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [inputDate, setInputDate] = useState("");
  const [dateReports, setDateReports] = useState([]);
  useEffect(() => {
    setLoadingFlag(true);
    axios
      .get(
        `/api/teacher/get_days_report?date=${new Date()}&courseId=${courseId}`,
        {
          headers: {
            email: user.email,
            password: user.password,
          },
        }
      )
      .then(({ data }) => {
        console.log("todays requests were fetched");
        setTodaysReports(data);
        setLoadingFlag(false);
      })
      .catch((err) => {
        setLoadingFlag(false);
        if (err?.response?.data?.message)
          setModalState({
            message: err?.response?.data?.message,
            status: err?.response?.status,
            hideFlag: false,
            errorFlag: true,
          });
      });
  }, []);

  const handleDateSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation()
    setHasRequestedReports(true);
    setLoadingFlag(true);
    axios
      .get(
        `/api/teacher/get_days_report?date=${inputDate}&courseId=${courseId}`,
        {
          headers: {
            email: user.email,
            password: user.password,
          },
        }
      )
      .then(({ data }) => {
        console.log(data,'dasds')
        setDateReports(data);
        setLoadingFlag(false);
        if (!data.length)
          setModalState({
            message: "no corses were found at the specified date",
            status: 404,
            errorFlag: true,
            hideFlag: false,
          });
      })
      .catch((err) => {
        setLoadingFlag(false);
        if (err?.response?.data?.message)
          setModalState({
            message: err?.response?.data?.message,
            status: err?.response?.status,
            hideFlag: false,
            errorFlag: true,
          });
      });
  };

  return (
    <section className="min-h-full flex flex-col items-center justify-start w-full p-4">
        <article className="w-full flex flex-col items-center max-w-4xl mb-8">
            <h2 className="text-2xl md:text-xl sm:text-lg text-start font-bold mb-4">Today`s Reports</h2>
            {loadingFlag ? (
                <LoadingSpinner />
            ) : todaysReports.length ? (
                <div className="w-full" id="todays-articles">
                    <Reports reports={todaysReports} />
                </div>
            ) : (
                <h2 className="text-red-500 md:text-red-400 sm:text-red-300">There were no calls made today</h2>
            )}
        </article>
        <article className="w-full max-w-4xl">
            <h2 className="text-2xl md:text-xl sm:text-lg font-bold mb-4">Get Reports by Date</h2>
            <form className="flex flex-col items-start space-y-4">
                <input
                    type="date"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    className="border text-black rounded p-2 w-full"
                    required
                />
                <button
                    onClick={(e) => handleDateSubmit(e)}
                    className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 transition"
                >
                    Submit
                </button>
            </form>
            {loadingFlag ? (
                <LoadingSpinner />
            ) : dateReports.length ? (
                <div id="date-articles" className="mt-4">
                    <Reports reports={dateReports} />
                </div>
            ) : hasRequestedReports ? (
                <h2 className="text-red-500 mt-4 md:text-red-400 sm:text-red-300">No reports found for this date</h2>
            ) : null}
        </article>
    </section>
  );
};

export default ReportsPage;
