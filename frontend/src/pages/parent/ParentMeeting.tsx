import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import InfoSection from "../../components/parent/common/InfoSection"
import daramgi from "../../assets/parent/meeting-daramgi.png"
import meetingTimeIcon from '../../assets/parent/meeting.png'

const meetings = [
  {
    id: 1,
    date: "2024.07.13",
    title: "개나리반 선생님과의 상담",
    time: "12:00 - 12:20",
    completed: true,
  },
  { 
    id: 2,
    date: "2024.07.04",
    title: "개나리반 선생님과의 상담",
    time: "12:00 - 12:20",
    completed: false,
  },
]

export default function ParentMeeting() {
  const navigate = useNavigate();
  const [scroll, setScroll] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (divRef.current) {
        const topPosition = divRef.current.getBoundingClientRect().top
        if (topPosition <= 200) {
          setScroll(true)
        } else {
          setScroll(false)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigateToSubmitPage = () => {
    navigate("/meeting/submit");
  }

  const navigateToMeetingRoomPage = (meetingId: number) => {
    navigate(`/meeting/${meetingId}`);
  }

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
          style={{ marginTop: '-40px' }}
        >
          <div className={`space-y-6 ${scroll ? 'overflow-y-auto' : 'overflow-hidden'}`} style={{ maxHeight: scroll ? 'calc(100vh - 200px)' : 'auto', paddingBottom: '100px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className={`flex flex-col p-4 rounded-2xl ${meeting.completed ? 'bg-[#FFF9D7] hover:bg-[#ffec8a] border-1 border-[#FFEC8A]' : 'bg-[#D3D3D3] cursor-not-allowed'} transition-colors duration-200`}
                onClick={() => meeting.completed && navigateToMeetingRoomPage(meeting.id)}
              >
                <div className="flex items-center">
                  <div>
                    <p className={`text-lg font-bold ${meeting.completed ? 'text-[#353c4e]' : 'text-gray-500'}`}>
                      {meeting.title}
                    </p>
                    <p className={`text-base font-bold ${meeting.completed ? 'text-[#757575]' : 'text-gray-400'}`}>
                      {meeting.date}
                    </p>
                    <p className={`text-base font-medium ${meeting.completed ? 'text-[#757575]' : 'text-gray-400'}`}>
                      {meeting.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="fixed right-10 z-50 bottom-20"
        onClick={navigateToSubmitPage}
      >
        <div
          className="w-[70px] h-[70px] rounded-full bg-[#ffec8a] flex items-center justify-center"
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
