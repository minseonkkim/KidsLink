import DiaryItem from "./GrowthItem"
import { Diary } from "../../../api/growthdiary"
import cryingDaramgi from "../../../assets/common/crying-daramgi.png"

interface GrowthListProps {
  filteredDiarys: Diary[];
  handleBoxClick: (diaryId: number) => void;
}

export default function GrowthList({ filteredDiarys, handleBoxClick }: GrowthListProps) {
  return (
    <div className="space-y-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)', paddingBottom: '100px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {filteredDiarys.length > 0 ? (
        filteredDiarys.map((diary) => (
          <DiaryItem key={diary.diaryId} diary={diary} handleBoxClick={handleBoxClick} />
        ))
      ) : (
        <div className="col-span-4 flex flex-col items-center justify-center">
          <img src={cryingDaramgi} alt="Crying Daramgi" className="w-16 mt-12 mb-4" />
          <p className="text-center text-gray-500">
            성장일지가 없습니다.
          </p>
        </div>
      )}
    </div>
  )
}
