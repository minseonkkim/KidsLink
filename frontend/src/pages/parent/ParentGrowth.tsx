import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../../components/parent/common/CommonHeader";

import daramgi from "../../assets/parent/growth-daramgi.png";

import cameraDaramgi from "../../assets/parent/daramgi.png"; // 임시 이미지

const growthEntries = [
  {
    id: 1,
    date: "2024.07.15 (월)",
    content: "오늘 민선이는 블록 놀이 시간에 정말 멋진 성을 만들었어요. ...",
    imageCount: 3,
    images: [cameraDaramgi, cameraDaramgi, cameraDaramgi],
  },
  {
    id: 2,
    date: "2024.07.12 (금)",
    content: "민선이는 오늘 그림 그리기를 통해 창의력을 발휘했어요.",
    imageCount: 0,
    images: [],
  },
  // 다른 성장 기록들 추가
];

const ParentGrowthPage: React.FC = () => {
  const [hoveredEntry, setHoveredEntry] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleBoxClick = (id: number) => {
    navigate(`/growth/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffec8a]">
      <CommonHeader title="성장 일지" />
      <div className="flex flex-1 flex-col justify-center items-center">
        <div className="w-full max-w-[455px] md:px-0">
          <div className="flex items-center justify-center mt-4">
            <div className="text-left mr-4">
              <p className="text-[6vw] md:text-[27px] font-medium text-[#212121]">
                교사가 전하는
              </p>
              <p className="text-[6vw] md:text-[27px] font-bold text-[#212121]">
                아이의 성장 이야기
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
            <div className="space-y-6">
              {growthEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="relative flex flex-col p-4 rounded-2xl bg-[#fff9d7] hover:bg-[#ffec8a] transition-colors duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredEntry(entry.id)}
                  onMouseLeave={() => setHoveredEntry(null)}
                  onClick={() => handleBoxClick(entry.id)}
                >
                  <p className="text-lg font-bold text-[#757575]">
                    {entry.date}
                  </p>
                  <p className="mt-2 text-lg font-medium text-[#353c4e]">
                    {entry.content}
                  </p>
                  {entry.imageCount > 0 && (
                    <p className="absolute right-4 top-4 text-[22px] font-bold text-[#7b87cf]">
                      +{entry.imageCount}
                    </p>
                  )}
                  {hoveredEntry === entry.id && entry.imageCount > 0 && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center p-4 rounded-2xl">
                      <img
                        src={entry.images[0]}
                        alt={`Growth ${entry.id}`}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentGrowthPage;
