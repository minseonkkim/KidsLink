import { getParentInfo, getClassTeacherInfo } from "../../../api/Info"
import { useParentInfoStore } from "../../../stores/useParentInfoStore"
import { useEffect, useState } from "react"
import daramgi from "../../../assets/join/default-profile.png"

export default function TeacherProfile() {
  const parentInfo = useParentInfoStore((state) => state.parentInfo)
  const setParentInfo = useParentInfoStore((state) => state.setParentInfo)
  const kindergartenClassId = parentInfo?.child.kindergartenClass.kindergartenClassId
  const [ teacherProfile, setTeacherProfile ] = useState<string>("")
  const [ teacherName, setTeacherName ] = useState<string>("")

  useEffect(() => {
    async function fetchParentInfo() {
      let currentLindergartenClassId = kindergartenClassId
      try {
        if (!parentInfo) {
          const fetchedParentInfo = await getParentInfo()
          setParentInfo(fetchedParentInfo)
          currentLindergartenClassId = fetchedParentInfo.child.kindergartenClass.kindergartenClassId
        }

        if (currentLindergartenClassId) {
          const teacherInfo = await getClassTeacherInfo(currentLindergartenClassId)
          setTeacherProfile(teacherInfo.profile)
          setTeacherName(teacherInfo.name)
        }
      } catch (error) {
        console.error("Failed to fetch teacher-info", error)
      }
    }
    fetchParentInfo()
  }, [kindergartenClassId, setParentInfo])

  return (
    <div className="ml-2 flex items-center mt-8">
      <div className="w-[30px] h-[30px] mr-3">
        <img
          src={teacherProfile || daramgi}
          className="w-full h-full object-cover rounded-full border-1 border-gray-700"
          alt="프로필 이미지"
        />
      </div>
      <p className="text-[16px] font-medium text-[#353c4e]">
        {teacherName} 선생님
      </p>
    </div>
  )
}


