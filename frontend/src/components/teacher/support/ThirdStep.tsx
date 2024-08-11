import { useState } from "react";
import TeacherMeetingSchedule from "../consulting/TeacherMeetingSchedule";
import DefaultImg from "../../../assets/teacher/default_profile.png";
import { format } from "date-fns";

export default function TeacherMeeting() {
  // 현재 날짜로 더미 데이터 생성
  const today = format(new Date(), "yyyy-MM-dd");

  const dummyMeetings = [
    {
      meetingId: 1,
      meetingDate: today,
      meetingTime: "10:00",
      childName: "훈이",
      parentProfile: DefaultImg
    },
    {
      meetingId: 2,
      meetingDate: today,
      meetingTime: "11:00",
      childName: "유리",
      parentProfile: DefaultImg
    },
    {
      meetingId: 3,
      meetingDate: today,
      meetingTime: "14:00",
      childName: "철수",
      parentProfile: DefaultImg
    }
  ];

  const [meetings, setMeetings] = useState(dummyMeetings);

  const tabs = [
    { label: "상담가능시간 open", link: "/meeting/reservation" },
    { label: "상담시간 확정", link: "/meeting/confirm" },
    { label: "예약된 화상상담", link: "/meeting/scheduled" },
    { label: "녹화된 상담", link: "/meeting/recordings" },
  ];

  return (
      <div className="w-full mt-3 mb-32 px-4 py-0 lg:px-8 lg:py-8">
        <div className="flex justify-center items-center">
          <div className="flex flex-row flex-wrap items-start content-start gap-4">
            {meetings.length === 0 ? (
              <div className="flex items-center justify-center w-full h-[400px] text-[18px]">
                예정된 상담 일정이 없어요.
              </div>
            ) : (
              meetings.map((meeting) => (
                <div key={meeting.meetingId}>
                  <TeacherMeetingSchedule
                    date={meeting.meetingDate}
                    time={meeting.meetingTime}
                    name={meeting.childName}
                    profileImgPath={meeting.parentProfile}
                    isActivate={true} // 기본적으로 활성화된 상태로 표시
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
  );
}
