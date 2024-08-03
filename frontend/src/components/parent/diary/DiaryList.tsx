import React from "react";

interface DiaryEntry {
  content: string;
  createDate: string;
  diaryId: number;
  images: string[];
  teacherName: string;
  thumbnail: string;
}

interface DiaryListProps {
  entries: DiaryEntry[];
  handleBoxClick: (diaryId: number) => void;
  scroll: boolean;
}

const DiaryList: React.FC<DiaryListProps> = ({ entries, handleBoxClick, scroll }) => {
  return (
    <div className={`space-y-6 overflow-auto`} style={{ maxHeight: 'calc(100vh - 200px)', paddingBottom: '100px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {entries.map((entry) => {
        const date = new Date(entry.createDate);
        const day = date.getDate();
        const weekDay = date.toLocaleString('ko-KR', { weekday: 'long' });

        return (
          <div
            key={entry.diaryId}
            className="flex bg-[#FFF9D7] hover:bg-[#ffec8a] transition-colors duration-200 cursor-pointer rounded-2xl overflow-hidden"
            onClick={() => handleBoxClick(entry.diaryId)}
          >
            <div className="flex flex-col items-center justify-center bg-[#FFF9D7] p-4 w-24">
              <span className="text-3xl font-bold text-[#757575]">{day}</span>
              <span className="text-lg text-[#757575]">{weekDay}</span>
            </div>
            <div className="relative flex-1 flex items-center">
              {entry.thumbnail ? (
                <div className="relative w-full h-32">
                  <img src={entry.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-center px-2">{entry.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 p-4">
                  <p className="text-[#353c4e] font-semibold">{entry.teacherName}</p>
                  <p className="text-[#353c4e]">{entry.content}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DiaryList;
