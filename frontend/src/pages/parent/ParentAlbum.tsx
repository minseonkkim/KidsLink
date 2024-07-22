import React, { useState } from 'react';
import CommonHeader from '../../components/parent/common/CommonHeader';
import { useNavigate } from 'react-router-dom';

import daramgi from "../../assets/parent/camera-daramgi.png";

import cameraDaramgi from '../../assets/parent/daramgi.png'; // 임시 이미지

const images = [
  { src: cameraDaramgi, date: '2024-07-15' },
  { src: cameraDaramgi, date: '2024-07-15' },
  { src: cameraDaramgi, date: '2024-07-12' },
  { src: cameraDaramgi, date: '2024-07-12' },
  { src: cameraDaramgi, date: '2024-07-11' },
  { src: cameraDaramgi, date: '2024-07-11' },
  { src: cameraDaramgi, date: '2024-07-09' },
  { src: cameraDaramgi, date: '2024-07-09' },
  { src: cameraDaramgi, date: '2024-07-09' },
];

const Album: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredImages, setFilteredImages] = useState(images);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setSearchTerm(selectedDate);
    if (selectedDate) {
      const filtered = images.filter((image) => image.date === selectedDate);
      setFilteredImages(filtered);
    } else {
      setFilteredImages(images);
    }
  };

  const handleDateClick = (date: string) => {
    navigate(`/album/${date}`);
  };

  const handleViewAllClick = () => {
    setSearchTerm('');
    setFilteredImages(images);
  };

  return (
    <div className="min-h-screen bg-[#ffec8a] flex flex-col">
      <CommonHeader title="앨범" />

      <div className="w-full flex flex-col items-center py-6 flex-1">
        <div className="flex items-center justify-center">
          <div className="text-left mr-4">
            <p className="text-[6vw] md:text-[27px] font-bold text-[#212121]">
              아이의 추억
            </p>
            <p className="text-[6vw] md:text-[27px] font-medium text-[#212121]">
              을 차곡차곡 담았어요!
            </p>
          </div>
          <img
              src={daramgi}
              className="w-full h-auto max-w-[150px] object-cover"
          />
        </div>

        <div className="w-full bg-white rounded-tl-[20px] rounded-tr-[20px] p-4 shadow-top max-w-[455px] flex flex-col min-h-[70vh]">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg shadow ${
                searchTerm === ''
                  ? 'bg-[#FDDA6E] text-[#212121]'
                  : 'border border-[#FDDA6E] text-[#FDDA6E]'
              }`}
              onClick={handleViewAllClick}
            >
              전체사진보기
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center w-full">
              <input
                type="date"
                value={searchTerm}
                onChange={handleDateChange}
                className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-[#FDDA6E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {filteredImages.map((image, index) => (
              <div key={index} className="relative w-full pt-[100%]">
                <img
                  src={image.src}
                  alt={`Album ${index}`}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg cursor-pointer"
                  onClick={() => handleDateClick(image.date)}
                />
              </div>
            ))}
            {filteredImages.length === 0 && (
              <p className="text-center text-gray-500 col-span-3">검색 결과가 없습니다.</p>
            )}
          </div>

          {/* 빈 공간을 채워 흰색 상자가 하단까지 내려오도록 설정 */}
          <div className="flex-grow"></div>
        </div>
      </div>
    </div>
  );
};

export default Album;
