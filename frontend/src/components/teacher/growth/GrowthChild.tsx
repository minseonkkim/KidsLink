interface GrowthChildProps {
    currentChild: boolean;
    name: string;
    profileImgPath: string;
    completed: boolean;
    onClick: () => void;
  }
  
  export default function GrowthChild({ currentChild, name, profileImgPath, completed, onClick }: GrowthChildProps) {
    return (
      <div onClick={onClick} className={`${currentChild ? 'border-[#B2D170] border-[3px]' : ''} flex flex-col justify-around items-center w-[160px] h-[180px] rounded-[10px] p-1 m-1 font-bold text-[20px] cursor-pointer`}>
        {!completed ? (
          <div className="w-[130px] h-[130px]">
            <img src={profileImgPath} className="w-full h-full rounded-full object-cover" />
          </div>
        ) : (
          <div className="relative w-[130px] h-[130px]">
            <img src={profileImgPath} className="w-full h-full rounded-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
              <span className="text-white">작성완료</span>
            </div>
          </div>
        )}
        <p>{name}</p>
      </div>
    );
  }
  