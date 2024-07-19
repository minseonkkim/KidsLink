import React from "react";
import { useParams } from "react-router-dom";
import CommonHeader from "../../components/parent/common/CommonHeader";
import cameraDaramgi from "../../assets/parent/daramgi.png"; // 다람쥐 이미지로 대체

const images = [
  { src: cameraDaramgi, date: "2024-07-15" },
  { src: cameraDaramgi, date: "2024-07-15" },
  { src: cameraDaramgi, date: "2024-07-12" },
  { src: cameraDaramgi, date: "2024-07-12" },
  { src: cameraDaramgi, date: "2024-07-11" },
  { src: cameraDaramgi, date: "2024-07-11" },
  { src: cameraDaramgi, date: "2024-07-09" },
  { src: cameraDaramgi, date: "2024-07-09" },
  { src: cameraDaramgi, date: "2024-07-09" },
];

const AlbumDetail: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const filteredImages = images.filter((image) => image.date === date);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <CommonHeader title="앨범" />
      <div className="flex flex-1 flex-col mt-8 items-center px-4">
        <div className="w-full max-w-[455px] mt-4">
          <div className="flex items-center mb-6">
            <div className="w-[30px] h-[30px] mr-2">
              {/* <img
                src="calendar.png"
                className="w-[30px] h-[30px] object-cover rounded-full"
                alt="캘린더 아이콘"
              /> */}
            </div>
            <p className="text-xl font-bold text-[#353c4e]">{date}</p>
          </div>
          <div className="w-full bg-[#fff9d7] rounded-[20px] px-6 py-8 shadow-lg">
            <div className="grid grid-cols-1 gap-4">
              {filteredImages.map((image, index) => (
                <div key={index} className="w-full">
                  <img
                    src={image.src}
                    alt={`Album ${index}`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;
