import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import CommonHeader from "../../components/parent/common/CommonHeader"
import InfoSection from "../../components/parent/common/InfoSection"
import SearchBar from "../../components/parent/common/SearchTitleBar"
import NoticeList from "../../components/parent/notice/NoticeList"
import daramgi from "../../assets/parent/notice-daramgi.png"
import { useNoticeStore } from "../../stores/parent/noticeStore"

export default function ParentNotice() {
  const navigate = useNavigate()
  const { filteredNotices, searchTitle, setSearchTitle, filterNotices } = useNoticeStore()
  const [scroll, setScroll] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    filterNotices()
  }, [searchTitle, filterNotices])

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

  const handleNoticeClick = (id: number) => {
    navigate(`/notice/${id}`)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(e.target.value)
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFEC8A]">
      <CommonHeader title="알림장" />

      <div className="w-full flex flex-col items-center mt-16 flex-grow">
        <InfoSection
          main1="백악관 유치원"
          main2="의"
          description2="알림을 확인하세요!"
          imageSrc={daramgi}
          altText="다람쥐"
        />

        <div
          ref={divRef}
          className="w-full bg-white rounded-tl-[20px] rounded-tr-[20px] px-12 shadow-top flex-grow overflow-hidden animate-slideUp"
          style={{ marginTop: '-40px' }}
        >
          <SearchBar searchTitle={searchTitle} handleSearch={handleSearch} />
          <NoticeList notices={filteredNotices} handleNoticeClick={handleNoticeClick} scroll={scroll} />
        </div>
      </div>
    </div>
  )
}
