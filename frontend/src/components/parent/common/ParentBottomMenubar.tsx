import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";

export default function ParentBottomMenubar() {
  return (
      <div className="w-[455px] h-[66px] fixed bottom-0 left-0">
        <div className="w-[455px] h-[66px] absolute left-[-1px] top-[-1px] bg-white" />
        <div className="w-[35px] h-[53px] absolute left-[53px] top-[9px]">
          <GoHomeFill className="w-[35px] h-[35px] absolute left-[-1px] top-[-1px] object-contain" style={{ color: '#757575' }} />
          <p className="absolute left-3 top-[38px] text-xs text-left text-[#757575]">홈</p>
        </div>
        <div className="w-[35px] h-[53px] absolute left-[151px] top-[9px]">
          <IoChatbubbleEllipsesOutline className="w-[35px] h-[35px] absolute left-[-1px] top-[-1px] object-contain" style={{ color: '#757575' }} />
          <p className="absolute left-1.5 top-[38px] text-xs text-left text-[#757575]">채팅</p>
        </div>
        <div className="w-14 h-[53px] absolute left-[359px] top-[9px]">
          <AiOutlineUser className="w-[35px] h-[35px] absolute left-2 top-[-1px] object-contain" style={{ color: '#757575' }} />
          <p className="absolute left-0 top-[38px] text-xs text-left text-[#757575]">마이페이지</p>
        </div>
      </div>
  )
}
