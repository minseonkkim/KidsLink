interface GrowthEntry {
  id: number;
  date: string;
  content: string;
  imageCount: number;
  images: string[];
}

interface GrowthListProps {
  entries: GrowthEntry[];
  handleBoxClick: (id: number) => void;
  scroll: boolean;
}

export default function GrowthList({ entries, handleBoxClick, scroll }: GrowthListProps) {
  return (
    <div className={`space-y-6 ${scroll ? 'overflow-y-auto' : 'overflow-hidden'}`} style={{ maxHeight: scroll ? 'calc(100vh - 200px)' : 'auto', paddingBottom: '100px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex flex-col md:flex-row p-4 rounded-2xl bg-[#FFF9D7] border-1 border-[#FFEC8A] hover:bg-[#FFEC8A] transition-transform duration-200 transform cursor-pointer"
          onClick={() => handleBoxClick(entry.id)}
        >
          {entry.imageCount > 0 && (
            <div className="w-full md:w-1/2 h-40 md:h-auto flex items-center justify-center">
              <img src={entry.images[0]} className="pb-4 w-full h-full object-contain rounded-lg" alt="성장 기록 이미지" />
            </div>
          )}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-4">
            <p className="text-base font-bold text-[#757575]">{entry.date}</p>
            <p className="text-lg font-medium text-[#212121] mt-2">{entry.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
