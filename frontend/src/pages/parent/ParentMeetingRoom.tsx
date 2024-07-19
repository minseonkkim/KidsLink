import { useState } from 'react';
import { IoMicOutline, IoMicOffOutline, IoVideocamOffOutline, IoVideocamOutline } from "react-icons/io5";
import bgImg from "../../assets/parent/meeting_bg.png";
import ParentNavigateBack from '../../components/parent/common/ParentNavigateBack';


export default function ParentMeeting() {
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);

  const toggleMic = () => setIsMicOn(prev => !prev);
  const toggleVideo = () => setIsVideoOn(prev => !prev);

  return (
    <>
      <div className="relative">
        <ParentNavigateBack backPage="목록" backLink='/meetinghome' />
        <div className="relative w-[455px] h-[918px]">
          <img src={bgImg} className="w-full h-full object-cover" alt='meeting'/>
          <div className="absolute inset-0 w-full h-full bg-[#897153] mix-blend-multiply" />
          <div className="absolute bottom-8 w-[455px] h-[50px] left-1/2 transform -translate-x-1/2 flex space-x-4 justify-center">
            <div className="bg-white p-2 rounded-full opacity-90 cursor-pointer" onClick={toggleMic}>
              {/* 컨트롤 바 커스터마이징 해서 넣을 수 있으면 넣을 것 */}
              {isMicOn ? <IoMicOutline className="text-3xl" /> : <IoMicOffOutline className="text-3xl" />}
            </div>
            <div className="bg-white p-2 rounded-full opacity-90 cursor-pointer" onClick={toggleVideo}>
              {isVideoOn ? <IoVideocamOutline className="text-3xl" /> : <IoVideocamOffOutline className="text-3xl" />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
