import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { formatDate } from "../../../utils/parent/dateUtils"

interface DiaryContentProps {
  createDate: string;
  content: string;
  images: { imageId: number; path: string }[];
}

export default function DiaryContent({ createDate, content, images }: DiaryContentProps) {
  return (
    <div className="relative w-full bg-[#fff9d7] rounded-[20px] mt-8 px-6 py-8 shadow-lg border-2 border-[#ffec8a]">
      {/* 테이프 효과 */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-yellow-300 z-10"></div>
      
      {images.length > 0 && (
        <Carousel
          className="mb-8"
          showThumbs={false}
          showStatus={false}
          infiniteLoop
        >
          {images.map((image) => (
            <div key={image.imageId}>
              <img
                src={image.path}
                alt={`성장 이미지 ${image.imageId}`}
                className="rounded-lg"
              />
            </div>
          ))}
        </Carousel>
      )}
      
      <p className="text-sm font-light text-[#353c4e] mb-6 text-center">
        {formatDate(createDate)}
      </p>
      <div className="text-base text-[#212121] space-y-4 whitespace-pre-line">
        {content}
      </div>
    </div>
  )
}

