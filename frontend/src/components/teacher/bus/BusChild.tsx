import { IoCallOutline } from "react-icons/io5";
import { useBusStore } from '../../../stores/useBusStore';

interface BusChildProps {
  busStopId: number;
  childId: number;
  childName: string;
  parentTel: string;
  status: string;
  checked: boolean;
  profile: string | null;
}

export default function BusChild({ busStopId, childId, childName, parentTel, status, checked, profile }: BusChildProps) {
  const toggleChildChecked = useBusStore((state) => state.toggleChildChecked);

  const handleCheckboxChange = () => {
    toggleChildChecked(busStopId, childId);
  };

  return (
    <div className={`flex flex-row items-center p-[14px] ${status === 'F' ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="lg:w-[80px] lg:h-[80px] w-[53px] h-[53px] mr-5">
        {profile ? (
          <img src={profile} className="w-full h-full rounded-full object-cover" />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start w-[178px]">
        <p className="font-bold text-[20px]">{childName}</p>
        <div className="flex flex-row items-center">
          <IoCallOutline className="mr-2 text-[#7C7C7C]" />
          <p className="text-[#7C7C7C] text-[14px]">{parentTel}</p>
        </div>
      </div>
      {status !== 'F' && (
        <input
          type="checkbox"
          className="w-5 h-5 accent-[#363636]"
          checked={checked}
          onChange={handleCheckboxChange}
        />
      )}
    </div>
  );
}
