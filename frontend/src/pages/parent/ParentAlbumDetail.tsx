import { useParams } from "react-router-dom"
import CommonHeader from "../../components/parent/common/CommonHeader"
import { FaRegCalendarCheck } from "react-icons/fa6"

import cameraDaramgi from "../../assets/parent/daramgi.png" // 임시 앨범 이미지

const images = [
  { src: cameraDaramgi, date: "2024-07-15" },
  { src: cameraDaramgi, date: "2024-07-15" },
  { src: cameraDaramgi, date: "2024-07-12" },
  { src: cameraDaramgi, date: "2024-07-12" },
  { src: cameraDaramgi, date: "2024-07-11" },
  { src: cameraDaramgi, date: "2024-07-11" },
  { src: cameraDaramgi, date: "2024-07-09" },
  { src: cameraDaramgi, date: "2024-07-09" },
  { src: cameraDaramgi, date: "2024-07-09" },
];

export default function AlbumDetail() {
  const { date } = useParams<{ date: string }>()
  const filteredImages = images.filter((image) => image.date === date)

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-white">
      <CommonHeader title="앨범" />
      <div className="flex flex-1 flex-col my-16 items-center px-6">
        <div className="relative w-full mt-4 mb-12">
          <div className="flex items-center my-6">
            <FaRegCalendarCheck className="w-[25px] h-[25px] mr-2 text-gray-700" />
            <p className="text-lg font-bold text-[#353c4e]">{date}</p>
          </div>
          
          <div className="relative w-full bg-[#fff9d7] rounded-[20px] px-6 py-8 shadow-lg border-2 border-[#ffec8a] bg-notebook-pattern">
             {/* 테이프 효과 */}
             <div className="absolute -top-4 -left-4 w-16 h-8 bg-yellow-300 rotate-12 transform z-10"></div>
            <div className="absolute -top-4 -right-4 w-16 h-8 bg-yellow-300 -rotate-12 transform z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-8 bg-yellow-300 -rotate-12 transform z-10"></div>
            <div className="absolute -bottom-4 -right-4 w-16 h-8 bg-yellow-300 rotate-12 transform z-10"></div>
            
            <div className="grid grid-cols-1 gap-4">
              {filteredImages.map((image, index) => (
                <div key={index} className="w-full">
                  <img
                    src={image.src}
                    alt={`Album ${index}`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
