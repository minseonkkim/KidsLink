import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CommonHeader from '../../components/parent/common/CommonHeader'
import InfoSection from "../../components/parent/common/InfoSection"
import SearchDateBar from "../../components/parent/common/SearchDateBar"
import daramgi from "../../assets/parent/camera-daramgi.png"
import cameraDaramgi from '../../assets/parent/daramgi.png'

const images = [
  { src: cameraDaramgi, date: '2024-07-15' },
  { src: cameraDaramgi, date: '2024-07-15' },
  { src: cameraDaramgi, date: '2024-07-12' },
  { src: cameraDaramgi, date: '2024-07-12' },
  { src: cameraDaramgi, date: '2024-07-11' },
  { src: cameraDaramgi, date: '2024-07-11' },
  { src: cameraDaramgi, date: '2024-07-09' },
  { src: cameraDaramgi, date: '2024-07-09' },
  { src: cameraDaramgi, date: '2024-07-09' },
]

export default function Album() {
  const [searchDate, setSearchDate] = useState('')
  const [filteredImages, setFilteredImages] = useState(images)
  const [scroll, setScroll] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value
    setSearchDate(selectedDate)
    if (selectedDate) {
      const filtered = images.filter((image) => image.date === selectedDate)
      setFilteredImages(filtered)
    } else {
      setFilteredImages(images)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (divRef.current) {
        const topPosition = divRef.current.getBoundingClientRect().top;
        if (topPosition <= 200) {
          setScroll(true)
        } else {
          setScroll(false)
        }
      }
    };

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleImageClick = (date: string) => {
    navigate(`/album/${date}`)
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center bg-[#FFEC8A]">
      <CommonHeader title="앨범" />

      <div className="w-full flex flex-col items-center mt-16 flex-grow">
        <InfoSection
          main1="아이의 추억"
          main2="을"
          description2="차곡차곡 담았어요!"
          imageSrc={daramgi}
          altText="다람쥐"
        />

        <div
          ref={divRef}
          className="w-full bg-white rounded-tl-[20px] rounded-tr-[20px] px-12 shadow-top flex-grow overflow-hidden animate-slideUp"
          style={{ marginTop: '-40px' }}
        >
          <SearchDateBar searchDate={searchDate} handleDateChange={handleDateChange} />
          <div className={`grid grid-cols-3 gap-4 ${scroll ? 'overflow-y-auto' : 'overflow-hidden'}`} style={{ maxHeight: scroll ? 'calc(100vh - 200px)' : 'auto', paddingBottom: '100px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {filteredImages.length > 0 ? (
              filteredImages.map((image, index) => (
                <div key={index} className="relative w-full pb-[100%]">
                  <img
                    src={image.src}
                    alt={`앨범 이미지 ${index + 1}`}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg cursor-pointer"
                    onClick={() => handleImageClick(image.date)}
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-lg col-span-3">해당 날짜의 사진이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
