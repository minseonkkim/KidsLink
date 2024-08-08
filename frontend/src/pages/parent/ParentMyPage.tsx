import { useEffect } from "react"
import { IoLogOutOutline } from "react-icons/io5"
import profileImg from "../../assets/parent/daramgi.png";
import { logout } from "../../api/member"
import { useNavigate } from "react-router-dom"
import useAppStore from "../../stores/store"
import { useParentInfoStore } from "../../stores/useParentInfoStore"
import { getParentInfo } from "../../api/Info"

export default function ParentMyPage() {
  const { parentInfo, setParentInfo } = useParentInfoStore()

  useEffect(() => {
    const fetchParentInfo = async () => {
      if (!parentInfo) {
        try {
          const fetchedParentInfo = await getParentInfo()
          setParentInfo(fetchedParentInfo);
        } catch (error) {
          console.error("Error fetching parent info:", error)
        }
      }
    }
    fetchParentInfo()
  }, [parentInfo, setParentInfo])

  const navigate = useNavigate()
  const setUserType = useAppStore((state) => state.setUserType)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed", error)
    } finally {
      setUserType("")
      navigate("/")
    }
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-[#FFEC8A] overflow-hidden">
      <div className="absolute bottom-0 h-[80%] flex flex-col w-full bg-white shadow-top rounded-tl-[20px] rounded-tr-[20px] py-4 px-8 animate-slideUp">
        <div
          className="mt-3 text-[17px] flex flex-row justify-end items-center py-3 px-1 cursor-pointer"
          onClick={handleLogout}
        >
          <IoLogOutOutline className="mr-1" /> 로그아웃
        </div>
        <div className="h-[1px] bg-[#B8B8B8]" />
        <div className="flex flex-col items-center mt-5 mb-1">
          <div className="relative mb-3">
            <img
              src={parentInfo.profile || profileImg}
              className="w-[120px] h-[120px] rounded-full object-cover"
            />
          </div>
        </div>
        <div className="font-semibold text-[20px] text-center mb-1">
          {parentInfo ? `${parentInfo.name} 학부모` : ""}
        </div>

        <div className="h-[1px] bg-[#B8B8B8] mt-5" />

        <div className="text-[17px] mt-6 m-2">아이 정보</div>
        <div className="rounded-[10px] bg-[#FFF9D7] w-full p-5 px-12 flex flex-row">
          <img
            src={parentInfo.child.profile || profileImg}
            className="w-[60px] h-[60px] rounded-full object-cover"
          />

          <div className="flex flex-col justify-center items-center flex-grow">
            <div className="mb-1">
              {parentInfo
                ? `${parentInfo.child.kindergartenClass.kindergarten.kindergatendName} ${parentInfo.child.kindergartenClass.kindergartenClassName}`
                : ""}
            </div>
            <div className="font-semibold text-[18px]">
              {parentInfo ? `${parentInfo.child.name}` : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
