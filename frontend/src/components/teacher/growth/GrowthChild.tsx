
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
      className="flex flex-col justify-around items-center w-[98px] lg:w-[137px] lg:h-[168px] h-[120px] rounded-[10px] p-1 m-2 font-bold text-[20px] cursor-pointer"
    >
      {!completed ? (
        <div className="lg:w-[120px] lg:h-[120px] w-[93px] h-[93px]">
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
