import profileImg from "../../../assets/teacher/profile_img.jpg";
import { IoCallOutline } from "react-icons/io5";
import { useBusStore } from '../../../stores/useBusStore';

interface BusChildProps {
  busStopId: number;
  childName: string;
  parentTel: string;
  status: string;
  checked: boolean;
}

export default function BusChild({ busStopId, childName, parentTel, status, checked }: BusChildProps) {
  const toggleChildChecked = useBusStore((state) => state.toggleChildChecked);

  const handleCheckboxChange = () => {
    toggleChildChecked(busStopId, childName);
  };

  return (
    <div className={`flex flex-row items-center p-[14px] ${status === 'F' ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="w-[80px] h-[80px] mr-5">
        <img src={profileImg} className="w-full h-full rounded-full object-cover" />
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
