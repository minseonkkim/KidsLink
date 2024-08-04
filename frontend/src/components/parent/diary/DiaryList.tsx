import DiaryItem from "./DiaryItem"
import { Diary } from "../../../api/growthdiary"

interface DiaryListProps {
  filteredDiarys: Diary[];
  handleBoxClick: (diaryId: number) => void;
}

export default function DiaryList({ filteredDiarys, handleBoxClick }: DiaryListProps) {
  return (
    <div className="space-y-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)', paddingBottom: '100px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {filteredDiarys.map((diary) => (
        <DiaryItem key={diary.diaryId} diary={diary} handleBoxClick={handleBoxClick} />
      ))}
    </div>
  )
}

