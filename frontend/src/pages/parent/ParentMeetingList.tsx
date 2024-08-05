// src/pages/ParentMeeting.js

import { useEffect, useRef, useState } from "react";
import InfoSection from "../../components/parent/common/InfoSection";
import daramgi from "../../assets/parent/meeting-daramgi.png";
import meetingTimeIcon from "../../assets/parent/meeting.png";
import ParentMeetingSchedule from "../../components/teacher/consulting/ParentMeetingSchedule";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { isMeetingActive, isMeetingVisible } from "../../utils/meeting";
import { MeetingInfo, ParentTeacherMeeting } from "../../types/meeting";
import { GetConfirmedMeeting, GetMeetingInfo } from "../../api/meeting";

export default function ParentMeeting() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<ParentTeacherMeeting[]>([]);
  const [teacherNames, setTeacherNames] = useState<{ [key: number]: string }>({});
  const [scroll, setScroll] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  const navigateToSubmitPage = () => {
    navigate("/meeting/submit");
  }

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await GetConfirmedMeeting();
        setMeetings(data);

        const teacherNamesData = await Promise.all(
          data.map(async (meeting) => {
            try {
              const meetingInfo: MeetingInfo = await GetMeetingInfo(meeting.meetingId);
              console.log(meetingInfo)
              console.log("meetingInfo")
              return { teacherId: meetingInfo.teacherId, name: meetingInfo.teacherName };
            } catch (error) {
              console.error(`Error fetching meeting info for ID ${meeting.meetingId}:`, error);
              return { teacherId: meeting.meetingId, name: "알 수 없음" };
            }
          })
        );

        const teacherNamesMap = teacherNamesData.reduce((acc, curr) => {
          acc["teacherName"] = curr.name;
          return acc;
        }, {} as { [key: number]: string });
        setTeacherNames(teacherNamesMap);
        console.log(teacherNames)
        console.log("teacherNames")
      } catch (error) {
        console.error("Failed to fetch confirmed meetings:", error);
      }
    };

    fetchMeetings();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (divRef.current) {
        const topPosition = divRef.current.getBoundingClientRect().top;
        setScroll(topPosition <= 200);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center bg-[#FFEC8A]">
      <div className="w-full flex flex-col items-center mt-16 flex-grow">
        <InfoSection
          main1="예약부터 상담까지"
          main2=""
          description2="온라인으로 한번에"
          imageSrc={daramgi}
          altText="다람쥐"
        />

        <div
          ref={divRef}
          className="w-full bg-white rounded-tl-[20px] rounded-tr-[20px] py-12 px-12 shadow-top flex-grow overflow-hidden animate-slideUp"
          style={{ marginTop: "-40px" }}
        >
          <div
            className={`space-y-6 ${scroll ? "overflow-y-auto" : "overflow-hidden"}`}
            style={{
              maxHeight: scroll ? "calc(100vh - 200px)" : "auto",
              paddingBottom: "100px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {meetings
            .filter(meeting => isMeetingVisible(meeting.meetingDate, meeting.meetingTime))
            .map((meeting) => (
              <Link to={`/meeting/${meeting.meetingId}`} key={meeting.meetingId}>
              <ParentMeetingSchedule
                key={meeting.meetingId}
                meetingId={meeting.meetingId}
                date={meeting.meetingDate}
                time={meeting.meetingTime}
                teacherName={teacherNames["teacherName"] || "알 수 없음"}
                isActive={isMeetingActive(meeting.meetingDate, meeting.meetingTime)}
              />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed right-10 z-50 bottom-20"
      onClick={navigateToSubmitPage}>
        <div
          className="w-[70px] h-[70px] rounded-full bg-[#ffec8a] flex items-center justify-center"
          style={{
            boxShadow:
              "0px 13px 27px -5px rgba(50,50,93,0.25), 0px 8px 16px -8px rgba(0,0,0,0.3)",
          }}
        >
          <img src={meetingTimeIcon} alt="상담 아이콘" className="w-[35px] h-[35px] object-contain" />
        </div>
      </div>
    </div>
  );
}
