import React from "react";
import { useParams } from "react-router-dom";
import CommonHeader from "../../components/parent/common/CommonHeader";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import profileImg from "../../assets/parent/notice-daramgi.png";
import cameraDaramgi from "../../assets/parent/daramgi.png"; // 다람쥐 이미지로 대체

const growthEntries = [
  {
    id: 1,
    date: "2024.07.15 (월)",
    content: "오늘 민선이는 블록 놀이 시간에 정말 멋진 성을 만들었어요. ...",
    images: [cameraDaramgi, cameraDaramgi, cameraDaramgi],
  },
  {
    id: 2,
    date: "2024.07.12 (금)",
    content: "민선이는 오늘 그림 그리기를 통해 창의력을 발휘했어요.",
    images: [],
  },
  // 다른 성장 기록들 추가
];

const ParentGrowthDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const entry = growthEntries.find(
    (entry) => entry.id === parseInt(id || "0", 10)
  );

  if (!entry) {
    return <p>해당 성장 기록을 찾을 수 없습니다.</p>;
  }

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-white">
      <CommonHeader title="성장 일지" />
      <div className="flex flex-1 flex-col my-16 items-center px-6">
        <div className="relative w-full mt-4 mb-12">
          <div className="flex items-center my-6">
            <div className="w-[40px] h-[40px] mr-2">
              <img
                src={profileImg}
                className="w-full h-full object-cover rounded-full"
                alt="프로필 이미지"
              />
            </div>
            <p className="text-lg font-medium text-[#353c4e]">개나리반 선생님</p>
          </div>

          <div className="relative w-full bg-[#fff9d7] rounded-[20px] px-6 py-8 shadow-lg border-2 border-[#ffec8a] bg-notebook-pattern">
            {/* 테이프 효과 */}
            <div className="absolute -top-4 -left-4 w-16 h-8 bg-yellow-300 rotate-12 transform z-10"></div>
            <div className="absolute -top-4 -right-4 w-16 h-8 bg-yellow-300 -rotate-12 transform z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-8 bg-yellow-300 -rotate-12 transform z-10"></div>
            <div className="absolute -bottom-4 -right-4 w-16 h-8 bg-yellow-300 rotate-12 transform z-10"></div>

            {entry.images.length > 0 && (
              <Carousel showThumbs={false} showStatus={false} infiniteLoop>
                {entry.images.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={`성장 이미지 ${index + 1}`} className="rounded-lg" />
                  </div>
                ))}
              </Carousel>
            )}
            <p className="text-sm font-light text-[#353c4e] mt-8 mb-4">
              {entry.date}
            </p>
            <div className="text-base text-[#212121] space-y-4 whitespace-pre-line">
              {entry.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentGrowthDetailPage;
