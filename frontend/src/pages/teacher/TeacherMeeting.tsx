import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdCalendar } from "react-icons/io";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import ProfileImg from '../../assets/teacher/profile_img.jpg';
import { getOneParentInfo } from "../../api/Info";
import TeacherMeetingSchedule from "../../components/teacher/consulting/TeacherMeetingSchedule";
import { isMeetingActive } from "../../utils/meeting";
import { ParentTeacherMeeting } from "../../types/meeting";
import { getConfirmedMeeting } from "../../api/meeting";

// Extend the ParentTeacherMeeting type
interface ExtendedParentTeacherMeeting extends ParentTeacherMeeting {
  parentName: string;
  parentProfile: string;
}

export default function TeacherMeeting() {
  const [meetings, setMeetings] = useState<ExtendedParentTeacherMeeting[]>([]);
  
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await getConfirmedMeeting();
        // console.log(data);
        setMeetings(data);

        const meetingsWithParentNames = await Promise.all(
          data.map(async (meeting) => {
            try {
              const parentInfo = await getOneParentInfo(meeting.parentId);
              console.log(parentInfo);
              return { 
                ...meeting, 
                parentName: parentInfo.child.name,
                parentProfile: parentInfo.profile || ProfileImg // Use default profile image if not available
              };
            } catch (error) {
              console.error(`Error fetching parent info for ID ${meeting.parentId}:`, error);
              return { 
                ...meeting, 
                parentName: "알 수 없음",
                parentProfile: ProfileImg // Use default profile image if error occurs
              };
            }
          })
        );

        setMeetings(meetingsWithParentNames);
      } catch (error) {
        console.error("Failed to fetch confirmed meetings:", error);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <>
      <TeacherHeader />
      <div className="mt-[130px] px-[130px]">
        <NavigateBack backPage="화상상담" backLink='/meeting' />
        <Title title="예약된 화상상담" />
        <div className="flex justify-center items-center">
          <div className="flex flex-row flex-wrap items-start content-start">
            {meetings.length === 0 ? (
              <div className="flex items-center justify-center w-full h-[400px] text-[18px]">
                예정된 상담 일정이 없어요.
              </div>
            ) : (
              meetings.map((meeting) => (
                <Link
                  to={`/meeting/${meeting.meetingId}`}
                  state={{ parentName: meeting.parentName }}
                  key={meeting.meetingId}
                >
                  <TeacherMeetingSchedule
                    date={meeting.meetingDate}
                    time={meeting.meetingTime}
                    name={meeting.parentName}
                    profileImgPath={meeting.parentProfile}
                    isActivate={isMeetingActive(meeting.meetingDate, meeting.meetingTime)}
                  />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
