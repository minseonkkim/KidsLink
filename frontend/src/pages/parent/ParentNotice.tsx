import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../../components/parent/common/CommonHeader";

import daramgi from "../../assets/parent/notice-daramgi.png";

const notices = [
  {
    id: 1,
    date: "2024.07.15 (월)",
    title: "딸기농장 현장실습",
    bgColor: "bg-[#fff9d7]",
    hoverColor: "hover:bg-[#ffec8a]",
  },
  {
    id: 2,
    date: "2024.07.12 (금)",
    title: "전통 놀이의 날",
    bgColor: "bg-[#f9fafc]",
    hoverColor: "hover:bg-[#e0e0e0]",
  },
  {
    id: 3,
    date: "2024.07.11 (목)",
    title: "공원에서의 자연 놀이",
    bgColor: "bg-[#f9fafc]",
    hoverColor: "hover:bg-[#e0e0e0]",
  },
  {
    id: 4,
    date: "2024.07.09 (화)",
    title: "씨앗 심기 체험",
    bgColor: "bg-[#f9fafc]",
    hoverColor: "hover:bg-[#e0e0e0]",
  },
];

const ParentNotice: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNotices, setFilteredNotices] = useState(notices);

  const handleNoticeClick = (id: number) => {
    navigate(`/notice/${id}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      const filtered = notices.filter((notice) => notice.title.includes(term));
      setFilteredNotices(filtered);
    } else {
      setFilteredNotices(notices);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffec8a]">
      <CommonHeader title="알림장" />
      <div className="flex flex-1 flex-col justify-center items-center">
        <div className="w-full max-w-[455px] md:px-0">
          <div className="flex items-center justify-center mt-4">
            <div className="text-left mr-4">
              <p className="text-[6vw] md:text-[27px] font-bold text-[#212121]">
                백악관 유치원의
              </p>
              <p className="text-[6vw] md:text-[27px] font-medium text-[#212121]">
                알림을 확인하세요!
              </p>
            </div>
            <img
              src={daramgi}
              className="w-full h-auto max-w-[150px] object-cover"
            />
          </div>
          <div
            className="w-full bg-white rounded-tl-[20px] rounded-tr-[20px] p-8 shadow-top"
            style={{ minHeight: "70vh" }}
          >
            <div className="flex items-center justify-between mb-6">
              <input
                type="text"
                placeholder="🔍︎"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border-b-2 border-gray-300 focus:outline-none custom-placeholder::placeholder custom-border-color"
              />
            </div>
            <div className="space-y-6">
              {filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className={`flex flex-col p-4 rounded-2xl ${notice.bgColor} ${notice.hoverColor} transition-colors duration-200 cursor-pointer`}
                  onClick={() => handleNoticeClick(notice.id)}
                >
                  <p className="text-lg font-bold text-[#757575]">
                    {notice.date}
                  </p>
                  <p className="text-[22px] font-bold text-[#353c4e]">
                    {notice.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentNotice;
