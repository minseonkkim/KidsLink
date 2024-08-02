import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdCalendar } from "react-icons/io";
import { GetConfirmedMeeting, ParentTeacherMeeting } from "../../api/meeting";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import ProfileImg from '../../assets/teacher/profile_img.jpg';
import { getOneParentInfo } from "../../api/Info";
import TeacherMeetingSchedule from "../../components/teacher/consulting/TeacherMeetingSchedule";

export default function TeacherMeeting() {
  
  const [meetings, setMeetings] = useState<ParentTeacherMeeting[]>([]);
  const [parentNames, setParentNames] = useState<{ [key: number]: string }>({});
  
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await GetConfirmedMeeting();
        setMeetings(data);

        const parentNamesData = await Promise.all(
          data.map(async (meeting) => {
            try {
              const parentInfo = await getOneParentInfo(meeting.parentId);
              return { parentId: meeting.parentId, name: parentInfo.child.name };
            } catch (error) {
              console.error(`Error fetching parent info for ID ${meeting.parentId}:`, error);
              return { parentId: meeting.parentId, name: "알 수 없음" };
            }
          })
        );

        const parentNamesMap = parentNamesData.reduce((acc, curr) => {
          acc[curr.parentId] = curr.name;
          return acc;
        }, {});
        setParentNames(parentNamesMap);
      } catch (error) {
        console.error("Failed to fetch confirmed meetings:", error);
      }
    };

    fetchMeetings();
  }, []);

  const isMeetingActive = (meetingTime: string): boolean => {
    const currentTime = new Date();
    const meetingDate = new Date(meetingTime);
    const timeDiff = meetingDate.getTime() - currentTime.getTime();

    // Meeting is active if it is within the next 10 minutes
    return timeDiff <= 10 * 60 * 1000 && timeDiff > 0;
  };

  return (
    <>
      <TeacherHeader />
      <div className="mt-[120px] px-[130px]">
        <NavigateBack backPage="홈" backLink='/' />
        <Title title="화상상담" />
        <Link to="/meeting/reservation">
          <button className="flex flex-row items-center absolute top-[125px] right-[150px] border-[2px] border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA]">
            <IoMdCalendar className="mr-1 text-[22px]" />
            상담가능시간 open
          </button>
        </Link>
        <div className="flex flex-row flex-wrap justify-between items-start">
          {meetings.map((meeting) => (
            <Link
              to={`/meeting/${meeting.meetingId}`}
              state={{ parentName: parentNames[meeting.parentId] || "알 수 없음" }}
              key={meeting.meetingId}
            >
              <TeacherMeetingSchedule
                time={meeting.meetingTime}
                name={parentNames[meeting.parentId] || "알 수 없음"}
                profileImgPath={ProfileImg}
                isActivate={true}
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
