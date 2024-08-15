import { formatDate } from "../../../utils/parent/dateUtils"

export default function NoticeItem({ notice, onClick }) {
  return (
    <div
      className="flex flex-col p-4 rounded-2xl bg-[#FFF9D7] hover:bg-[#FFEC8A] transition-colors duration-200 cursor-pointer"
      onClick={() => onClick(notice.noticeBoardId)}
    >
      <p className="text-base font-bold text-[#757575]">
        {formatDate(notice.noticeBoardDate)}
      </p>
      <p className="text-lg font-medium text-[#353c4e]">{notice.title}</p>
    </div>
  )
}

