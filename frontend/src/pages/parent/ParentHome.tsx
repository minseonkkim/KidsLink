import { useNavigate } from "react-router-dom"
import InfoSection from "../../components/parent/common/InfoSection"
import Menu from "../../components/parent/main/Menu"
import daramgi from "../../assets/parent/daramgi.png"

export default function ParentHome() {
  const navigate = useNavigate()

  const handleMenuClick = (link: string) => {
    if (link) {
      navigate(link)
    }
  }

  return (
    <div className="flex flex-col bg-[#FFEC8A]">
      <InfoSection
        main1="김민선 학부모님"
        description2="만나서 반가워요!"
        imageSrc={daramgi}
        altText="다람쥐"
      />

      <div className="z-20 w-full flex flex-col justify-center items-center rounded-tl-[20px] rounded-tr-[20px] bg-white shadow-top px-6 py-4">
        <p className="text-center text-[18px] my-6 font-medium">
          유치원과의 편리한 소통
        </p>
        <Menu onMenuClick={handleMenuClick} />
      </div>
    </div>
  )
}