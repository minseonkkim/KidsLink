import React, { useState } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { FormDiaryData, createDiary } from "../../../api/growthdiary.ts";
import { showToastError } from "../common/ToastNotification.tsx";

export default function GrowthDiaryForm({
  closeModal,
  currentChildId,
  childs,
  fetchDiarys,
  initialDateValue,
  initialRecordValue,
  initialSelectedImages,
}) {
  const [dateValue, setDateValue] = useState<string>(initialDateValue);
  const [recordValue, setRecordValue] = useState<string>(initialRecordValue);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handlePlusImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      setSelectedImages((prevImages) => [...prevImages, ...files]);
    } catch (error) {
      console.error("이미지 선택 오류:", error);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentChildId === null) {
      showToastError(<div>"아이를 선택해주세요"</div>);
      return;
    }

    const selectedChild = childs.find(
      (child) => child.childId === currentChildId
    );
    if (!selectedChild) return;

    if (!dateValue) {
      showToastError(<div>"날짜를 선택해주세요"</div>);
      return;
    }

    if (!recordValue.trim()) {
      showToastError(<div>"내용을 입력해주세요"</div>);
      return;
    }

    const diaryData: FormDiaryData = {
      diaryDate: dateValue,
      files: selectedImages,
      content: recordValue,
    };

    try {
      await createDiary(selectedChild.childId, diaryData);
      setSelectedImages([]);
      setDateValue("");
      setRecordValue("");
      closeModal();
      fetchDiarys();
    } catch (error) {
      console.error("Failed to create diary:", error);
      showToastError(<div>"성장일지 작성에 실패했습니다."</div>);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-[500px]">
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-row items-center">
          <label className="block mr-3 mb-1 font-bold whitespace-nowrap text-[18px]">
            날짜
          </label>
          <input
            type="date"
            name="date"
            className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-[#FDDA6E]"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            max={today}
          />
        </div>
        <div className="mb-4 flex flex-row">
          <label className="block mr-3 mb-1 font-bold whitespace-nowrap text-[18px]">
            사진
          </label>
          <label htmlFor="photo">
            <div className="cursor-pointer bg-[#f4f4f4] w-[100px] h-[100px] rounded-[10px] flex items-center justify-center border-[1px]">
              <IoCameraOutline className="text-[40px]" />
            </div>
          </label>
          <input
            type="file"
            id="photo"
            className="hidden"
            onChange={handlePlusImage}
            multiple
          />
          <div className="w-full h-[120px] ml-2 flex flex-row overflow-x-auto whitespace-nowrap custom-x-scrollbar">
            {selectedImages.map((file, index) => (
              <div
                key={index}
                className="w-[100px] h-[100px] relative mr-2 flex-shrink-0"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Selected ${index}`}
                  className="object-cover w-[100px] h-[100px] rounded-[10px] border-[1px]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-1 absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4 flex flex-row">
          <label className="block mr-3 mb-1 font-bold whitespace-nowrap text-[18px]">
            기록
          </label>
          <textarea
            name="record"
            className="border border-gray-300 p-2 rounded w-full"
            rows={8}
            value={recordValue}
            onChange={(e) => setRecordValue(e.target.value)}
          ></textarea>
        </div>
        <div className="flex items-center justify-center">
          <button className="w-[70px] h-[38px] border-[2px] border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[8px] hover:bg-[#D4DDEA]">
            등록
          </button>
        </div>
      </form>
    </div>
  );
}
