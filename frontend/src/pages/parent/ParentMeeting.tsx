import { useEffect, useState } from "react"
import InfoSection from "../../components/parent/common/InfoSection"
import MeetingList from "../../components/parent/meeting/MeetingList"
import daramgi from "../../assets/parent/meeting-daramgi.png"
import meetingTimeIcon from "../../assets/parent/meeting.png"
import { GetConfirmedMeeting, GetMeetingInfo } from "../../api/meeting"
import { useNavigate } from "react-router-dom"
import { ParentTeacherMeeting } from "../../types/meeting"

export interface MeetingInfo {
  id: number;
  date: string;
  time: string;
  teacherId: number;
  teacherName: string;
  parentId: number;
  childName: string;
}

export default function ParentMeeting() {
  const navigate = useNavigate()
  const [meetings, setMeetings] = useState<ParentTeacherMeeting[]>([])
  const [teacherNames, setTeacherNames] = useState<{ [key: number]: string }>({})

  const isMeetingActive = (date: string, time: string): boolean => {
    const currentTime = new Date()
    const meetingDate = new Date(`${date}T${time}`)
    const timeDiff = meetingDate.getTime() - currentTime.getTime()
    return timeDiff <= 10 * 60 * 1000 && timeDiff > 0
  }

  const navigateToSubmitPage = () => {
    navigate("/meeting/submit")
  }

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await GetConfirmedMeeting()
        setMeetings(data)

        const teacherNamesData = await Promise.all(
          data.map(async (meeting) => {
            try {
              const meetingInfo: MeetingInfo = await GetMeetingInfo(meeting.meetingId)
              return { teacherId: meetingInfo.teacherId, name: meetingInfo.teacherName }
            } catch (error) {
              console.error(`Error fetching meeting info for ID ${meeting.meetingId}:`, error)
              return { teacherId: meeting.meetingId, name: "알 수 없음" }
            }
          })
        )

        const teacherNamesMap = teacherNamesData.reduce((acc, curr) => {
          acc[curr.teacherId] = curr.name
          return acc
        }, {} as { [key: number]: string })
        setTeacherNames(teacherNamesMap)
      } catch (error) {
        console.error("Failed to fetch confirmed meetings:", error)
      }
    }
    fetchMeetings()
  }, [])


  return (
    <div className="flex flex-col h-screen bg-[#FFEC8A]">
      <InfoSection
        main1="예약부터 상담까지"
        main2=""
        description2="온라인으로 한번에"
        imageSrc={daramgi}
        altText="다람쥐"
      />
      
      <div className="flex flex-col flex-grow overflow-hidden rounded-tl-[20px] rounded-tr-[20px] bg-white shadow-top px-12 py-4 animate-slideUp -mt-10">
        <MeetingList
          meetings={meetings}
          teacherNames={teacherNames}
          isMeetingActive={isMeetingActive}
          scroll={scroll}
        />
      </div>

      {/* 상담 예약 아이콘 */}
      <div className="fixed right-10 z-40 bottom-20" onClick={navigateToSubmitPage}>
        <div
          className="z-50 w-[70px] h-[70px] rounded-full bg-[#ffec8a] flex items-center justify-center"
          style={{
            boxShadow:
              "0px 13px 27px -5px rgba(50,50,93,0.25), 0px 8px 16px -8px rgba(0,0,0,0.3)",
          }}
        >
          <img src={meetingTimeIcon} alt="상담 아이콘" className="w-[35px] h-[35px] object-contain" />
        </div>
      </div>
    </div>
  )
}
