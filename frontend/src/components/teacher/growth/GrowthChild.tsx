
interface GrowthChildProps {
  name: string;
  profileImgPath: string;
  completed: boolean;
  onClick: () => void;
}

export default function GrowthChild({ name, profileImgPath, completed, onClick }: GrowthChildProps) {
  return (
    <div 
      onClick={onClick} 
      className="flex flex-col justify-around items-center w-[156px] h-[168px] rounded-[10px] p-2 m-1 font-bold text-[20px] cursor-pointer"
    >
      {!completed ? (
        <div className="w-[120px] h-[120px]">
          <img src={profileImgPath} className="w-full h-full rounded-full object-cover" />
        </div>
      ) : (
        <div className="relative w-[120px] h-[120px]">
          <img src={profileImgPath} className="w-full h-full rounded-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
            <span className="text-white">작성완료</span>
          </div>
        </div>
      )}
      <p className="mt-2">{name}</p>
    </div>
  );
}
