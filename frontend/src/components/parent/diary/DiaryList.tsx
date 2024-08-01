import React from "react";

interface DiaryListProps {
  entries: any[];
  handleBoxClick: (id: number) => void;
  scroll: boolean;
}

const DiaryList: React.FC<DiaryListProps> = ({ entries, handleBoxClick, scroll }) => {
  return (
    <div className={`space-y-6 ${scroll ? 'overflow-y-auto' : 'overflow-hidden'}`} style={{ maxHeight: scroll ? 'calc(100vh - 200px)' : 'auto', paddingBottom: '100px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {entries.map((entry) => (
        <div
          key={entry.diaryId}
          className="flex flex-col p-4 rounded-2xl bg-[#FFF9D7] border-1 border-[#FFEC8A] hover:bg-[#ffec8a] transition-colors duration-200 cursor-pointer"
          onClick={() => handleBoxClick(entry.diaryId)}
        >
          <div className="flex items-center">
            <div>
              <p className="text-base font-bold text-[#757575]">
                {entry.createDate}
              </p>
              <div className="flex items-center">
                <p className="text-lg font-medium text-[#353c4e] pt-1">
                  {entry.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DiaryList;
