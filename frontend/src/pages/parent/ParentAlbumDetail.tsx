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
    <div className="min-h-screen flex flex-col justify-between bg-[#ffec8a]">
      <CommonHeader title="앨범" />
      <div className="relative flex-1 flex flex-col justify-center items-center py-6">
        <div className="absolute left-[46px] top-[103px] flex items-center">
          <img
            src="calendar.png"
            className="w-[30px] h-[30px] object-contain"
            alt="Calendar"
          />
          <p className="ml-2 text-xl font-bold text-left text-[#353c4e]">
            {date}
          </p>
        </div>

        <div className="w-full max-w-[455px] md:px-0 mt-[161px]">
          <div
            className="w-full bg-[#fff9d7] rounded-[20px] shadow-top p-4"
            style={{ minHeight: "70vh" }}
          >
            {filteredImages.map((image, index) => (
              <div key={index} className="w-full mb-4">
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
  );
};

export default AlbumDetail;
