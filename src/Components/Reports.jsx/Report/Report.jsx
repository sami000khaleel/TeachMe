import React from "react";
import { useNavigate } from "react-router-dom";

const Report = ({ report }) => {
  const navigate = useNavigate();

  const handleReportClick = () => {
    navigate(`/report/${report.callId}`);
  };

  const formatLectureTime = (lectureTime) =>
    lectureTime.split(",")[0][0] === "0"
      ? lectureTime.split(",")[1]
      : lectureTime;

  return (
    <div
      onClick={handleReportClick}
      className="border w-full  border-primaryDark rounded-lg p-6 m-4 cursor-pointer hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-primaryDarkBackground text-primaryLightText dark:text-primaryDarkText sm:p-4 sm:m-2"
    >
      <p className="text-2xl font-semibold mb-2 sm:text-md sm:mb-1">
       <span className="text-primaryDark ">
        Total Lecture Time:{" "}
         </span>
        <span className="font-normal">
          {formatLectureTime(report.totalLectureTime)}
        </span>
      </p>
      <p className="text-2xl font-semibold mb-2 sm:text-md sm:mb-1">
       <span className="text-primaryDark ">
        Number of Attendances:{" "}
         </span>
        <span className="font-normal">{report.numberOfAttendences}</span>
      </p>
      <p className="text-2xl font-semibold mb-2 sm:text-md sm:mb-1">
       <span className="text-primaryDark ">
        Was Given At:{" "}
         </span>
        <span className="font-normal">
          {new Date(report.startedAt).toLocaleDateString("en-US", {
            weekday: "long",
          })}
        </span>
      </p>
      <p className="text-2xl font-semibold mb-2 sm:text-md sm:mb-1">
       <span className="text-primaryDark ">
        Started At:{" "}
         </span>
        <span className="font-normal">
          {new Date(report.startedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </p>
      <p className="text-2xl font-semibold sm:text-md">
       <span className="text-primaryDark "> 
        Ended At:{" "}
        </span>
        <span className="font-normal">
          {new Date(report.endedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </p>
    </div>
  );
};

export default Report;
