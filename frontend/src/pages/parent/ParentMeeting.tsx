import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../../components/parent/common/CommonHeader";

import daramgi from "../../assets/parent/meeting-daramgi.png";
import meetingTimeIcon from '../../assets/parent/meeting.png';


const meetings = [
  {
    // id
    date: "2024.07.13",
    title: "학습 지도 상담",
    time: "12:00 - 12:20",
    // 상담완료: T/F
    bgColor: "bg-[#fff9d7]", //- 색은 위에 T/F로 달라지게 추가
    hoverColor: "hover:bg-[#ffec8a]",
  },
  {
    // id
    date: "2024.07.04",
    title: "학습 지도 상담",
    time: "12:00 - 12:20",
    bgColor: "bg-[#f9fafc]",
    hoverColor: "hover:bg-[#e0e0e0]",
  },
];

const ParentMeeting: React.FC = () => {
  const navigate = useNavigate();

  const navigateToSubmitPage = () => {
    navigate("/meeting/submit");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffec8a]">
      <CommonHeader title="상담" />
      <div className="flex flex-1 flex-col justify-center items-center">
        <div className="w-full max-w-[455px] md:px-0">
          <div className="flex items-center justify-center mt-4">
            <div className="text-left mr-4">
              <p className="text-[6vw] md:text-[27px] font-bold text-[#212121]">
                예약부터 상담까지
              </p>
              <p className="text-[6vw] md:text-[27px] font-medium text-[#212121]">
                온라인으로 한번에
              </p>
            </div>
            <img
              src={daramgi}
              className="w-full h-auto max-w-[150px] object-cover"
              />
          </div>
          <div
            className="w-full bg-white rounded-tl-[20px] rounded-tr-[20px] p-8 shadow-top"
            style={{ minHeight: "70vh" }}
          >
            <div className="space-y-6">
              {meetings.map((meeting, index) => (
                <div
                  key={index}
                  className={`flex flex-col p-4 rounded-2xl ${meeting.bgColor} ${meeting.hoverColor} transition-colors duration-200`}
                >
                  <div className="flex items-center">
                    <div>
                      <p className="text-[22px] font-bold text-[#353c4e]">
                        {meeting.title}
                      </p>
                      <p className="text-lg font-bold text-[#757575]">
                        {meeting.date}
                      </p>
                      <p className="text-lg font-medium text-[#757575]">
                        {meeting.time}
                      </p>
                    </div>
                    <svg
                      width={40}
                      height={40}
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 ml-auto"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <rect width={40} height={40} rx={20} fill="#EADDFF" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M26.0002 16C26.0002 19.3137 23.314 22 20.0002 22C16.6865 22 14.0002 19.3137 14.0002 16C14.0002 12.6863 16.6865 10 20.0002 10C23.314 10 26.0002 12.6863 26.0002 16ZM24.0002 16C24.0002 18.2091 22.2094 20 20.0002 20C17.7911 20 16.0002 18.2091 16.0002 16C16.0002 13.7909 17.7911 12 20.0002 12C22.2094 12 24.0002 13.7909 24.0002 16Z"
                        fill="#21005D"
                      />
                      <path
                        d="M20.0002 25C13.5259 25 8.00952 28.8284 5.9082 34.192C6.4201 34.7004 6.95934 35.1812 7.52353 35.6321C9.08827 30.7077 13.997 27 20.0002 27C26.0035 27 30.9122 30.7077 32.477 35.6321C33.0412 35.1812 33.5804 34.7004 34.0923 34.1921C31.991 28.8284 26.4746 25 20.0002 25Z"
                        fill="#21005D"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className="fixed right-10 z-50 bottom-20 md:bottom-16"
        onClick={navigateToSubmitPage}
      >
        <div
          className="w-[70px] h-[70px] rounded-full bg-[#ffec8a] flex items-center justify-center"
          style={{
            boxShadow:
              "0px 13px 27px -5px rgba(50,50,93,0.25), 0px 8px 16px -8px rgba(0,0,0,0.3)",
          }}
        >
          <img
            src={meetingTimeIcon}
            alt="상담 아이콘"
            className="w-[35px] h-[35px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ParentMeeting;
