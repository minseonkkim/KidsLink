import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Title from "../../components/teacher/common/Title";
import ProfileImg from '../../assets/teacher/profile_img.jpg';
import { getOneParentInfo } from "../../api/Info";
import TeacherMeetingSchedule from "../../components/teacher/consulting/TeacherMeetingSchedule";
import { isMeetingActive, isMeetingVisible } from "../../utils/meeting";
import { ParentTeacherMeeting } from "../../types/meeting";
import { getConfirmedMeeting } from "../../api/meeting";
import TeacherLayout from '../../layouts/TeacherLayout';
import daramgi from "../../assets/teacher/meeting-daramgi.png";

export default function TeacherMeeting() {
  const [meetings, setMeetings] = useState<ParentTeacherMeeting[]>([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await getConfirmedMeeting();

        const meetingsWithParentNames = await Promise.all(
          data.map(async (meeting) => {
            try {
              const parentInfo = await getOneParentInfo(meeting.parentId);
              return { 
                ...meeting, 
                childName: parentInfo.child.name,
                parentProfile: parentInfo.profile || ProfileImg // Use default profile image if not available
              };
            } catch (error) {
              console.error(`Error fetching parent info for ID ${meeting.parentId}:`, error);
              return { 
                ...meeting, 
                childName: "알 수 없음",
                parentProfile: ProfileImg // Use default profile image if error occurs
              };
            }
          })
        );

        // 상담을 날짜와 시간순으로 정렬
        const sortedMeetings = meetingsWithParentNames.sort((a, b) => {
          const dateA = new Date(`${a.meetingDate}T${a.meetingTime}`);
          const dateB = new Date(`${b.meetingDate}T${b.meetingTime}`);
          return dateA.getTime() - dateB.getTime();
        });

        // 과거 상담을 숨김
        const visibleMeetings = sortedMeetings.filter(meeting =>
          isMeetingVisible(meeting.meetingDate, meeting.meetingTime)
        );

        setMeetings(visibleMeetings);
      } catch (error) {
        console.error("Failed to fetch confirmed meetings:", error);
      }
    };

    fetchMeetings();
  }, []);

  const tabs = [
    { label: "상담가능시간 open", link: "/meeting/reservation" },
    { label: "상담시간 확정", link: "/meeting/confirm" },
    { label: "예약된 화상상담", link: "/meeting/scheduled" },
    { label: "녹화된 상담", link: "/meeting/recordings" },
];

return (
    <TeacherLayout
        activeMenu="meeting"
        setActiveMenu={() => {}}
        titleComponent={<Title
          title="예약된 화상상담"
          tooltipContent={<div className="w-[260px] leading-relaxed">화상상담 10분 전부터 방에 입장할 수 있어요.</div>}
          tabs={tabs}
        />}
        imageSrc={daramgi} 
    >
      <div className="w-full mt-10 mb-32 px-4 lg:px-8 py-6 lg:py-8">
        <div className="flex justify-center items-center">
          <div className="flex flex-row flex-wrap items-start content-start gap-4">
            {meetings.length === 0 ? (
              <div className="flex items-center justify-center w-full h-[400px] text-[18px]">
                예정된 상담 일정이 없어요.
              </div>
            ) : (
              meetings.map((meeting) => (
                <Link
                  to={`/meeting/${meeting.meetingId}`}
                  state={{ parentName: meeting.childName }}
                  key={meeting.meetingId}
                >
                  <TeacherMeetingSchedule
                    date={meeting.meetingDate}
                    time={meeting.meetingTime}
                    name={meeting.childName}
                    profileImgPath={meeting.parentProfile}
                    isActivate={isMeetingActive(meeting.meetingDate, meeting.meetingTime)}
                  />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
