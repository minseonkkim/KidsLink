import { formatDate } from "../../../utils/parent/dateUtils"

export default function NoticeContent({ title, date, content }) {
  return (
    <div className="relative w-full bg-[#fff9d7] rounded-[20px] mt-8 px-6 py-8 shadow-lg border-2 border-[#ffec8a]">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-yellow-300 z-10"></div>
      <p className="text-[20px] font-bold text-[#212121] mb-2 text-center">
        {title}
      </p>
      <p className="text-[14px] font-light text-[#353c4e] mb-6 text-center">
        {formatDate(date)}
      </p>
      <div className="text-[16px] text-[#212121] space-y-4 whitespace-pre-line">
        {content}
      </div>
    </div>
  )
}