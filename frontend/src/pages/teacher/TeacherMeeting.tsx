import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdCalendar } from "react-icons/io";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import ProfileImg from '../../assets/teacher/profile_img.jpg';
import { getOneParentInfo } from "../../api/Info";
import TeacherMeetingSchedule from "../../components/teacher/consulting/TeacherMeetingSchedule";
import { isMeetingActive, isMeetingVisible } from "../../utils/meeting";
import { ParentTeacherMeeting } from "../../types/meeting";
import { GetConfirmedMeeting } from "../../api/meeting";

export default function TeacherMeeting() {
  const [meetings, setMeetings] = useState<ParentTeacherMeeting[]>([]);
  const [parentNames, setParentNames] = useState<{ [key: number]: string }>({});
  
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await GetConfirmedMeeting();
        // console.log(data);
        setMeetings(data);

        const parentNamesData = await Promise.all(
          data.map(async (meeting) => {
            try {
              const parentInfo = await getOneParentInfo(meeting.parentId);
              console.log(parentInfo)
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
  // console.log("meetings: ", meetings)

  // 비활성화 된 경우, 클릭되지 않는 로직 추가해야함.
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
                  state={{ parentName: parentNames[meeting.parentId] || "알 수 없음" }}
                  key={meeting.meetingId}
                >
                  <TeacherMeetingSchedule
                    date={meeting.meetingDate}
                    time={meeting.meetingTime}
                    name={parentNames[meeting.parentId] || "알 수 없음"}
                    profileImgPath={ProfileImg}
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
