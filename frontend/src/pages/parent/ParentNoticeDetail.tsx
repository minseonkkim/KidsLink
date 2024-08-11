import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import profileImg from "../../assets/parent/notice-daramgi.png"
import { getNoticeDetail } from "../../api/notice"
import { NoticeDetail } from "../../api/notice"
import TeacherProfile from "../../components/parent/common/TeacherProfile"
import LoadingSpinner from "../../components/common/LoadingSpinner"

export default function ParentNoticeDetail() {
  const { noticeId } = useParams<{ noticeId: string }>()
  const [notice, setNotice] = useState<NoticeDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        if (noticeId) {
          const detail = await getNoticeDetail(Number(noticeId));
          setNotice(detail)
          setLoading(false)
        }
      } catch (error) {
        console.error("Failed to fetch notice detail:", error)
        setLoading(false)
      }
    }

    fetchNoticeDetail()
  }, [noticeId])

  if (loading) {
    return <LoadingSpinner/>
  }

  if (!notice) {
    return <p>해당 알림장을 찾을 수 없습니다.</p>
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  }

  return (
    <>
      <div className="flex flex-col px-6">
        <TeacherProfile profileImg={profileImg} teacherName={notice.teacherName} />

        <div className="relative w-full bg-[#fff9d7] rounded-[20px] mt-8 px-6 py-8 shadow-lg border-2 border-[#ffec8a]">
          {/* 테이프 효과 */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-yellow-300 z-10"></div>

          <p className="text-[20px] font-bold text-[#212121] mb-2 text-center">
            {notice.title}
          </p>
          <p className="text-[14px] font-light text-[#353c4e] mb-6 text-center">
            {formatDate(notice.noticeBoardDate)}
          </p>
          <div className="text-[16px] text-[#212121] space-y-4 whitespace-pre-line">
            {notice.content}
          </div>
        </div>
      </div>
    </>
  )
}
