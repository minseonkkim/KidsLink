import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import InfoSection from "../../components/parent/common/InfoSection"
import daramgi from "../../assets/parent/notice-daramgi.png"
import { getAllNotices } from "../../api/notice"
import SearchTitleBar from "../../components/parent/common/SearchTitleBar"
import NoticeList from "../../components/parent/notice/NoticeList"
import { Notice } from "../../types/notice"

export default function ParentNotice() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Notice[]>([])
  const [searchTitle, setSearchTitle] = useState("")

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const fetchedNotices = await getAllNotices()
        const reversedNotices = fetchedNotices.reverse()
        setNotices(reversedNotices)
      } catch (error) {
        console.error("Failed to fetch notices:", error)
      }
    }
    fetchNotices()
  }, [])

  const handleSearch = (e) => {
    const title = e.target.value
    setSearchTitle(title)
  }

  const filteredNotices = searchTitle
    ? notices.filter((notice) =>
        notice.title.toLowerCase().includes(searchTitle.toLowerCase())
      )
    : notices

  const handleNoticeClick = (noticeId) => {
    navigate(`/notice/${noticeId}`)
  }

  return (
    <div className="flex flex-col h-screen bg-[#FFEC8A]">
      <InfoSection
        main1="중요한 알림"
        main2="을"
        description2="확인하세요!"
        imageSrc={daramgi}
        altText="다람쥐"
      />

      <div className="flex flex-col flex-grow overflow-hidden rounded-tl-[20px] rounded-tr-[20px] bg-white shadow-top px-12 py-4 animate-slideUp">
        <SearchTitleBar searchTitle={searchTitle} onSearch={handleSearch} />
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          <NoticeList notices={filteredNotices} onClick={handleNoticeClick} />
        </div>
      </div>
    </div>
  )
}
