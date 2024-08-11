import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import profileImg from "../../assets/parent/notice-daramgi.png"
import { getGrowthDiary, DiaryDetail } from "../../api/growthdiary"
import TeacherProfile from "../../components/parent/common/TeacherProfile"
import DiaryContent from "../../components/parent/diary/DiaryContent"

export default function ParentDiaryDetail() {
  const { diaryId } = useParams<{ diaryId: string }>()
  const [diary, setDiary] = useState<DiaryDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGrowthDiary() {
      try {
        if (diaryId) {
          const data = await getGrowthDiary(parseInt(diaryId))
          setDiary(data)
          setLoading(false)
        }
      } catch (error) {
        console.error("Failed to fetch growth diary", error)
        setLoading(false);
      }
    }
    fetchGrowthDiary()
  }, [diaryId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!diary) {
    return <p>해당 성장 기록을 찾을 수 없습니다.</p>
  }

  return (
    <div className="flex flex-col px-6">
      <TeacherProfile profileImg={profileImg} teacherName={diary.teacherName} />
      <DiaryContent createDate={diary.createDate} content={diary.content} images={diary.images} />
    </div>
  )
}
