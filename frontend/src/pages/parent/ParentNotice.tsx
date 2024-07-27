import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import CommonHeader from "../../components/parent/common/CommonHeader"
import InfoSection from "../../components/parent/common/InfoSection"
import daramgi from "../../assets/parent/notice-daramgi.png"
import { useNoticeStore } from "../../stores/noticeStore"
import { getAllNotices } from "../../api/notice"

export default function ParentNotice() {
  const navigate = useNavigate()
  const notices = useNoticeStore((state) => state.notices)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredNotices, setFilteredNotices] = useState(notices)
  const [scroll, setScroll] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        await getAllNotices()
      } catch (error) {
        console.error("Failed to fetch notices:", error)
      }
    }

    fetchNotices()
  }, [])

  useEffect(() => {
    setFilteredNotices(notices)
  }, [notices])

  const handleNoticeClick = (id: number) => {
    navigate(`/notice/${id}`)
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    if (term) {
      const filtered = notices.filter((notice) =>
        notice.title.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredNotices(filtered)
    } else {
      setFilteredNotices(notices)
    }
  };

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

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFEC8A]">
      <CommonHeader title="알림장" />
      <div className="w-full flex flex-col items-center mt-16 flex-grow">
        <InfoSection
          main1="알림장"
          main2="을"
          description2="확인"
          imageSrc={daramgi}
          altText="다람쥐"
        />
        <div
          ref={divRef}
          className="w-full bg-white rounded-tl-[20px] rounded-tr-[20px] px-12 shadow-top flex-grow overflow-hidden animate-slideUp"
          style={{ marginTop: "-40px" }}
        >
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="🔍︎"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 my-6 border-b-2 border-gray-300 focus:outline-none focus:border-[#FDDA6E]"
            />
          </div>
          <div
            className={`space-y-6 ${scroll ? "overflow-y-auto" : "overflow-hidden"}`}
            style={{
              maxHeight: scroll ? "calc(100vh - 200px)" : "auto",
              paddingBottom: "100px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {filteredNotices.map((notice) => (
              <div
                key={notice.noticeBoardId}
                className={`flex flex-col p-4 rounded-2xl bg-[#FFF9D7] hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer`}
                onClick={() => handleNoticeClick(notice.noticeBoardId)}
                style={{
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  transform: "rotateX(10deg)",
                  perspective: "1000px",
                  border: "2px solid #FFEC8A",
                }}
              >
             
                <p className="text-base font-bold text-[#757575]">{notice.noticeBaordDate}</p>
                <p className="text-lg font-medium text-[#353c4e]">{notice.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


