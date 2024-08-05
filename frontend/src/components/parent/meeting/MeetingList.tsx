import { Link } from "react-router-dom"
import ParentMeetingSchedule from "../../teacher/consulting/ParentMeetingSchedule"

export default function MeetingList({ meetings, teacherNames, isMeetingActive, scroll }) {
  return (
    <div
      className={`space-y-6 pt-8 ${scroll ? "overflow-y-auto" : "overflow-hidden"}`}
      style={{
        maxHeight: scroll ? "calc(100vh - 200px)" : "auto",
        paddingBottom: "100px",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {meetings.map((meeting) => (
        <Link to={`/meeting/${meeting.meetingId}`} key={meeting.meetingId}>
          <ParentMeetingSchedule
            key={meeting.meetingId}
            meetingId={meeting.meetingId}
            date={meeting.meetingDate}
            time={meeting.meetingTime}
            teacherName={teacherNames[meeting.teacherId] || "알 수 없음"}
            isActive={isMeetingActive(meeting.meetingDate, meeting.meetingTime)}
          />
        </Link>
      ))}
    </div>
  )
}
