import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './parent-schedule.css';
import CommonHeader from '../../components/parent/common/CommonHeader';
import daramgi from '../../assets/parent/document-daramgi.png';
import { createDosageDocument, createAbsentDocument } from '../../api/document';

const ParentDocument: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('med');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleDateChange = (update: [Date | null, Date | null]) => {
    const [start, end] = update;
    setStartDate(start || undefined);
    setEndDate(end || undefined);
    if (end) {
      setIsOpen(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const commonData = {
      startDate: startDate?.toISOString().split('T')[0],
      endDate: endDate?.toISOString().split('T')[0],
    };

    try {
      if (selectedOption === 'med') {
        const dosageData = {
          ...commonData,
          name: formData.name,
          volume: parseFloat(formData.volume),
          num: parseInt(formData.num),
          times: formData.times.split(',').map((time: string) => time.trim()),
          storageInfo: formData.storageInfo,
          details: formData.details,
          confirmationStatus: 'F',
        };
        console.log(dosageData)
        await createDosageDocument(dosageData);
      } else if (selectedOption === 'absent') {
        const absentData = {
          ...commonData,
          reason: formData.reason,
          specialNotes: formData.specialNotes,
        };
        console.log(absentData)
        await createAbsentDocument(absentData);
      }
      // 성공 시 사용자에게 알림 또는 페이지 이동 등 추가 처리
    } catch (error) {
      console.error('Error submitting document:', error);
      // 오류 처리
    }
  };

  const handleDateClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      <CommonHeader title="서류 제출" />
      <div className="w-full flex flex-col items-center my-16 flex-grow">
        <div className="flex flex-col items-center mt-10">
          <img
            src={daramgi}
            className="w-20 h-20 object-cover rounded-full"
            alt="프로필 이미지"
          />
          <p className="text-base font-bold text-[#212121] mt-4">김민선</p>
        </div>
        <div className="w-full p-8 mt-4">
          <div className="mb-6">
            <div className="flex justify-center items-center mb-4">
              <label className="mr-4">
                <input
                  type="radio"
                  value="med"
                  checked={selectedOption === 'med'}
                  onChange={handleOptionChange}
                  className="mr-2 focus:outline-none focus:ring-2 focus:ring-[#FDDA6E]"
                />
                투약
              </label>
              <label>
                <input
                  type="radio"
                  value="absent"
                  checked={selectedOption === 'absent'}
                  onChange={handleOptionChange}
                  className="mr-2 focus:outline-none focus:ring-2 focus:ring-[#FDDA6E]"
                />
                결석
              </label>
            </div>
            <div className="mb-4">
              <p className="text-base font-medium text-left text-[#353c4e] mb-2">
                기간 선택
              </p>
              <div className="relative">
                <div onClick={handleDateClick} className="p-2 border rounded w-full cursor-pointer">
                  {startDate && endDate ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}` : '시작 날짜 - 종료 날짜'}
                </div>
                {isOpen && (
                  <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <DatePicker
                      selected={startDate}
                      onChange={handleDateChange}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      inline
                      onClickOutside={() => setIsOpen(false)}
                      className="datepicker-custom"
                    />
                  </div>
                )}
              </div>
            </div>
            {selectedOption === 'med' && (
              <>
                {['name', 'volume', 'num', 'times', 'storageInfo', 'details'].map((label, index) => (
                  <div className="mb-4" key={index}>
                    <p className="text-base font-medium text-left text-[#353c4e] mb-2">
                      {label === 'name' ? '약의 종류' :
                        label === 'volume' ? '투약 용량' :
                          label === 'num' ? '투약 횟수' :
                            label === 'times' ? '투약 시간 (쉼표로 구분)' :
                              label === 'storageInfo' ? '보관 방법' :
                                '특이 사항'}
                    </p>
                    {label === 'details' ? (
                      <textarea name={label} className="w-full p-2 border rounded" onChange={handleInputChange}></textarea>
                    ) : (
                      <input type="text" name={label} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#FDDA6E]" onChange={handleInputChange} />
                    )}
                  </div>
                ))}
              </>
            )}
            {selectedOption === 'absent' && (
              <>
                {['reason', 'specialNotes'].map((label, index) => (
                  <div className="mb-4" key={index}>
                    <p className="text-base font-medium text-left text-[#353c4e] mb-2">
                      {label === 'reason' ? '사유' : '기타 사항'}
                    </p>
                    {label === 'specialNotes' ? (
                      <textarea name={label} className="w-full p-2 border rounded" onChange={handleInputChange}></textarea>
                    ) : (
                      <input type="text" name={label} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#FDDA6E]" onChange={handleInputChange} />
                    )}
                  </div>
                ))}
              </>
            )}
            <div className="flex justify-center mt-10">
              <button
                className="w-[99px] h-[51px] bg-[#ffec8a] rounded-full flex items-center justify-center text-base font-medium text-[#212121]"
                onClick={handleSubmit}
              >
                제출
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDocument;
