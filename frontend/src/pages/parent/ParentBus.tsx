import CommonHeader from "../../components/parent/common/CommonHeader"
import InfoSection from "../../components/parent/common/InfoSection"
import daramgi from "../../assets/parent/bus-daramgi.png"


export default function ParentBus() {

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFEC8A]">
      <CommonHeader title="버스" />

      <div className="w-full flex flex-col items-center mt-16 flex-grow">
        <InfoSection
          description1="버스가"
          main1="이동 중"
          main2=" 입니다!"

          imageSrc={daramgi}
          altText="다람쥐"
        />

        <div
          className="w-full bg-white rounded-tl-[20px] rounded-tr-[20px] px-10 shadow-top flex-grow overflow-hidden animate-slideUp"
          style={{ marginTop: '-40px' }}
        >
        </div>
        
      </div>
    </div>
  )
}