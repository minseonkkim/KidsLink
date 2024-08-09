import { useEffect, useState } from "react"
import InfoSection from "../../components/parent/common/InfoSection"
import MeetingList from "../../components/parent/meeting/MeetingList"
import daramgi from "../../assets/parent/meeting-daramgi.png"
import meetingTimeIcon from "../../assets/parent/meeting.png"
import { getConfirmedMeeting } from "../../api/meeting"
import { useNavigate } from "react-router-dom"
import { ParentTeacherMeeting } from "../../types/meeting"

export default function ParentMeeting() {
  const navigate = useNavigate()
  const [meetings, setMeetings] = useState<ParentTeacherMeeting[]>([]) // 회의 목록 상태

  // 상담 시작 10분전부터 활성화 시키기
  const isMeetingActive = (date: string, time: string): boolean => {
    // const currentTime = new Date() // 현재 시간
    // const meetingStartTime = new Date(`${date}T${time}:00`) // 상담 시작 시간
    // const meetingEndTime = new Date(meetingStartTime.getTime() + 30 * 60 * 1000) // 상담 종료 시간 (시작 시간 + 30분)
    // const meetingActivationTime = new Date(meetingStartTime.getTime() - 10 * 60 * 1000) // 상담 활성화 시간 (시작 시간 - 10분)
  
    // 현재 시간이 상담 활성화 시간 이후이고, 상담 종료 시간 이전인지 확인
    // return currentTime >= meetingActivationTime && currentTime <= meetingEndTime
    return true // 테스트용으로 상담실 다 활성화되게 만듦(실제로는  여기 없애고 위에 주석해제해야함)
  }

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const meetings = await getConfirmedMeeting() // 확정된 상담목록 조회
        const filteredMeetings = meetings.filter(meeting => {
          const meetingEndTime = new Date(new Date(`${meeting.meetingDate}T${meeting.meetingTime}:00`).getTime() + 30 * 60 * 1000)
          return new Date() <= meetingEndTime
        })
        setMeetings(filteredMeetings)
      } catch (error) {
        console.error("Failed to fetch meetings: ", error)
      }
    }    
    fetchMeetings()
  }, [])

  
  const navigateToSubmitPage = () => {
    navigate("/meeting/submit")
  }

  return (
    <div className="flex flex-col h-screen bg-[#FFEC8A]">
      <InfoSection
        main1="예약부터 상담까지"
        main2=""
        description2="온라인으로 한번에"
        imageSrc={daramgi}
        altText="다람쥐"
      />

      <div className="flex flex-col flex-grow overflow-hidden rounded-tl-[20px] rounded-tr-[20px] bg-white shadow-top px-12 pt-12 pb-4 animate-slideUp">
        {meetings.length === 0 ? (
          <p className="text-center text-gray-500">예약된 상담이 없습니다.</p>
        ) : (
          <MeetingList meetings={meetings} isMeetingActive={isMeetingActive} />
        )}
      </div>

      {/* 상담 예약 아이콘 */}
      <div
        className="fixed right-10 z-40 bottom-20"
        onClick={navigateToSubmitPage}
      >
        <div
          className="z-50 w-[70px] h-[70px] rounded-full bg-[#ffec8a] flex items-center justify-center"
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
  )
}
