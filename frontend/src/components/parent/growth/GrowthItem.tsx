import { Diary } from "../../../api/growthdiary"

interface DiaryItemProps {
  diary: Diary;
  handleBoxClick: (diaryId: number) => void;
}

export default function DiaryItem({ diary, handleBoxClick }: DiaryItemProps) {
  const date = new Date(diary.createDate)
  const day = date.getDate()
  const weekDay = date.toLocaleString('ko-KR', { weekday: 'long' })

  return (
    <div
      className="flex bg-[#FFF9D7] hover:bg-[#ffec8a] transition-colors duration-200 cursor-pointer rounded-2xl overflow-hidden"
      onClick={() => handleBoxClick(diary.diaryId)}
    >
      <div className="flex flex-col items-center justify-center bg-[#FFF9D7] p-4 w-24">
        <span className="text-3xl font-bold text-[#757575]">{day}</span>
        <span className="text-lg text-[#757575]">{weekDay}</span>
      </div>
      <div className="h-32 relative flex-1 flex items-center bg-[#ffec8a]">
        {diary.thumbnail ? (
          <div className="relative w-full">
            <img src={diary.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-center px-2">{diary.content}</p>
            </div>
          </div>
        ) : (
          <div className="w-full p-4">
            <p className="text-[#353c4e] overflow-hidden whitespace-nowrap text-ellipsis">{diary.content}</p>
          </div>
        )}
      </div>
    </div>
  )
}