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

    // 상담 시간 30분 전후로 활성화 상태로 설정
    return timeDiff > -30 * 60 * 1000 && timeDiff < 30 * 60 * 1000;
  };

  const isMeetingVisible = (meetingTime: string): boolean => {
    const currentTime = new Date();
    const meetingDate = new Date(meetingTime);

    const currentDate = new Date(currentTime);
    currentDate.setHours(0, 0, 0, 0);

    // 날짜가 지난 상담은 보이지 않게 설정
    if (meetingDate < currentDate) {
      return false;
    }

    // 날짜가 같은 경우, 상담 시간이 지난 것만 보이지 않게 설정
    if (meetingDate.toDateString() === currentTime.toDateString()) {
      return meetingDate >= currentTime;
    }

    // 날짜가 지나지 않은 경우 모두 보이게 설정
    return true;
  };

  // 비활성화 된 경우, 클릭되지 않는 로직 추가해야함.
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
          {meetings
            .filter(meeting => isMeetingVisible(meeting.meetingTime))
            .map((meeting) => (
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
                  isActivate={isMeetingActive(meeting.meetingTime)}
                />
              </Link>
          ))}
        </div>
      </div>
    </>
  );
}
