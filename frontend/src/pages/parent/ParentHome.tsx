import { useNavigate } from "react-router-dom"
import ParentHeader from "../../components/parent/common/HomeHeader"
import InfoSection from "../../components/parent/common/InfoSection"
import Menu from "../../components/parent/main/Menu"
import daramgi from "../../assets/parent/daramgi.png"
import { useEffect } from 'react';
import { useParentInfoStore } from '../../stores/useParentInfoStore'

export default function ParentHome() {
  // 부모 정보 가져오기
  const fetchParentInfo = useParentInfoStore((state) => state.fetchParentInfo);
  const parentInfo = useParentInfoStore((state) => state.parentInfo);

  useEffect(() => {
    fetchParentInfo();
  }, [fetchParentInfo]);


  const navigate = useNavigate();

  const handleMenuClick = (link: string) => {
    if (link) {
      navigate(link)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFEC8A]">
      <ParentHeader />

      <div className="w-full flex flex-col items-center my-16 flex-grow">
        <InfoSection
          main1="김민선 학부모님"
          description2="만나서 반가워요!"
          imageSrc={daramgi}
          altText="다람쥐"
        />
        
        <div className="w-full bg-white rounded-tl-[20px] rounded-tr-[20px] px-12 shadow-top flex-grow">
          <p className="text-center text-lg font-medium mt-10 mb-8">
            유치원과의 편리한 소통
          </p>
          <Menu onMenuClick={handleMenuClick} />
        </div>
      </div>

    </div>
  )
}
