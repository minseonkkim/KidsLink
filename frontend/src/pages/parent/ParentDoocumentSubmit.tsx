import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CommonHeader from '../../components/parent/common/CommonHeader';
import daramgi from '../../assets/parent/document-daramgi.png';

const ParentDocument: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('med');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {
    // 제출 로직
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <CommonHeader title="서류 제출" />
      <div className="flex flex-1 flex-col justify-center items-center p-4">
        <div className="w-full max-w-[455px] md:px-0">
          <div className="flex flex-col items-center mt-4">
            <img
              src={daramgi}
              className="w-24 h-24 object-cover rounded-full"
              alt="프로필 이미지"
            />
            <p className="text-[22px] font-bold text-[#212121] mt-4">김민선</p>
          </div>
          <div
            className="w-full p-8 mt-4"
            style={{ minHeight: '70vh' }}
          >
            <div className="mb-6">
              <div className="flex justify-center items-center mb-4">
                <label className="mr-4">
                  <input
                    type="radio"
                    value="med"
                    checked={selectedOption === 'med'}
                    onChange={handleOptionChange}
                  />
                  투약
                </label>
                <label>
                  <input
                    type="radio"
                    value="absent"
                    checked={selectedOption === 'absent'}
                    onChange={handleOptionChange}
                  />
                  결석
                </label>
              </div>
              <div className="mb-4">
                <p className="text-[17px] font-medium text-left text-[#353c4e]">
                  기간 선택
                </p>
                <div className="flex space-x-4">
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date) => setStartDate(date)}
                    className="p-2 border rounded"
                  />
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date) => setEndDate(date)}
                    className="p-2 border rounded"
                  />
                </div>
              </div>
              {selectedOption === 'med' && (
                <>
                  <div className="mb-4">
                    <p className="text-[17px] font-medium text-left text-[#353c4e]">
                      약의 종류
                    </p>
                    <input type="text" className="w-full p-2 border rounded" />
                  </div>
                  <div className="mb-4">
                    <p className="text-[17px] font-medium text-left text-[#353c4e]">
                      투약 용량
                    </p>
                    <input type="text" className="w-full p-2 border rounded" />
                  </div>
                  <div className="mb-4">
                    <p className="text-[17px] font-medium text-left text-[#353c4e]">
                      투약 횟수
                    </p>
                    <input type="text" className="w-full p-2 border rounded" />
                  </div>
                  <div className="mb-4">
                    <p className="text-[17px] font-medium text-left text-[#353c4e]">
                      투약 시간
                    </p>
                    <input type="text" className="w-full p-2 border rounded" />
                  </div>
                  <div className="mb-4">
                    <p className="text-[17px] font-medium text-left text-[#353c4e]">
                      보관 방법
                    </p>
                    <input type="text" className="w-full p-2 border rounded" />
                  </div>
                  <div className="mb-4">
                    <p className="text-[17px] font-medium text-left text-[#353c4e]">
                      특이 사항
                    </p>
                    <textarea className="w-full p-2 border rounded"></textarea>
                  </div>
                </>
              )}
              {selectedOption === 'absent' && (
                <>
                  <div className="mb-4">
                    <p className="text-[17px] font-medium text-left text-[#353c4e]">
                      사유
                    </p>
                    <input type="text" className="w-full p-2 border rounded" />
                  </div>
                  <div className="mb-4">
                    <p className="text-[17px] font-medium text-left text-[#353c4e]">
                      기타 사항
                    </p>
                    <textarea className="w-full p-2 border rounded"></textarea>
                  </div>
                </>
              )}
              <div className="flex justify-center mt-10">
                <button
                  className="w-[99px] h-[51px] bg-[#ffec8a] rounded-full flex items-center justify-center text-[17px] font-medium text-[#212121]"
                  onClick={handleSubmit}
                >
                  제출
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDocument;
