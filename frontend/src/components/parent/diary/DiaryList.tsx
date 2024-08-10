import DiaryItem from "./DiaryItem"
import { Diary } from "../../../api/growthdiary"
import daramgi from '../../../assets/parent/crying-daramgi.png'

interface DiaryListProps {
  filteredDiarys: Diary[];
  handleBoxClick: (diaryId: number) => void;
}

export default function DiaryList({ filteredDiarys, handleBoxClick }: DiaryListProps) {
  return (
    <div className="space-y-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)', paddingBottom: '100px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {filteredDiarys.length > 0 ? (
        filteredDiarys.map((diary) => (
          <DiaryItem key={diary.diaryId} diary={diary} handleBoxClick={handleBoxClick} />
        ))
      ) : (
        <div className="col-span-4 flex flex-col items-center justify-center">
          <img src={daramgi} alt="Crying Daramgi" className="w-20 mt-12 mb-4" />
          <p className="text-center text-gray-500">
            성장일지가 없습니다.
          </p>
        </div>
      )}
    </div>
  )
}
