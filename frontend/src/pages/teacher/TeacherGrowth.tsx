import React, { useState, useEffect } from "react";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { IoSearch, IoCameraOutline } from "react-icons/io5";
import GrowthChild from "../../components/teacher/growth/GrowthChild";
import GrowthDiaryItem from "../../components/teacher/growth/GrowthDiaryItem";
import { FiPlusCircle } from "react-icons/fi";
import useModal from "../../hooks/teacher/useModal.tsx";
import { FaTrash } from "react-icons/fa";
import ToastNotification, {
  showToast,
  showToastError,
} from "../../components/teacher/common/ToastNotification.tsx";
import useTeacherInfoStore from "../../stores/useTeacherInfoStore.ts";
import { getClassChilds } from "../../api/kindergarten.ts";
import {
  createDiary,
  getKidAllGrowthDiarys,
  FormDiaryData,
} from "../../api/growthdiary.ts";

export default function TeacherGrowth() {
  const { openModal, Modal, isModalOpen, closeModal } = useModal();
  const [searchChild, setSearchChild] = useState<string>("");
  const [growthDiaryData, setGrowthDiaryData] = useState([]);

  const [currentChildId, setCurrentChildId] = useState<number | null>(null);
  const [childs, setChilds] = useState([]);

  const checkChildCompletion = async (childs) => {
    const updatedChilds = await Promise.all(
      childs.map(async (child) => {
        const fetchedDiarys = await getKidAllGrowthDiarys(child.childId);
        const today = new Date().toISOString().split("T")[0];
        const hasTodayDiary = fetchedDiarys.some(
          (diary) => diary.createDate === today
        );
        return { ...child, completed: hasTodayDiary };
      })
    );
    setChilds(updatedChilds);
  };

  useEffect(() => {
    const classId =
      useTeacherInfoStore.getState().teacherInfo.kindergartenClassId;
    const fetchChilds = async () => {
      try {
        const fetchedChilds = await getClassChilds(classId);
        await checkChildCompletion(fetchedChilds);
      } catch (error) {
        console.error("Failed to fetch childs:", error);
      }
    };

    fetchChilds();
  }, []);

  const handleChildClick = (id: number) => {
    setCurrentChildId(id);
  };

  const fetchDiarys = async () => {
    try {
      const fetchedDiarys = await getKidAllGrowthDiarys(currentChildId);
      const sortedDiarys = fetchedDiarys.sort(
        (a, b) =>
          new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
      );
      setGrowthDiaryData(sortedDiarys);

      const today = new Date().toISOString().split("T")[0];
      setChilds((prevItems) =>
        prevItems.map((child) => {
          if (child.childId === currentChildId) {
            const hasTodayDiary = fetchedDiarys.some(
              (diary) => diary.createDate === today
            );
            return { ...child, completed: hasTodayDiary };
          }
          return child;
        })
      );
    } catch (error) {
      console.log("Failed to fetch diarys:", error);
    }
  };

  useEffect(() => {
    if (currentChildId !== null) {
      fetchDiarys();
    }
  }, [currentChildId]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchChild(event.target.value);
  };

  const filteredChildren = childs.filter((child) =>
    child.name.includes(searchChild)
  );

  const handleDiaryItemClick = (id: number) => {
    if (currentChildId === null) {
      showToast("아이를 선택해주세요");
    } else {
      setCurrentChildId(id);
    }
  };

  const renderModalContent = (
    currentDateValue,
    currentRecordValue,
    currentSelectedImages
  ) => (
    <GrowthDiaryForm
      closeModal={closeModal}
      currentChildId={currentChildId}
      childs={childs}
      fetchDiarys={fetchDiarys}
      initialDateValue={currentDateValue}
      initialRecordValue={currentRecordValue}
      initialSelectedImages={currentSelectedImages}
    />
  );

  const [currentDateValue, setCurrentDateValue] = useState<string>("");
  const [currentRecordValue, setCurrentRecordValue] = useState<string>("");
  const [currentSelectedImages, setCurrentSelectedImages] = useState<string[]>(
    []
  );

  const openCreateModal = () => {
    if (currentChildId === null) {
      showToastError(<div>"아이를 선택해주세요"</div>);
    } else if (!isModalOpen) {
      openModal(
        renderModalContent(
          currentDateValue,
          currentRecordValue,
          currentSelectedImages
        )
      );
    }
  };

  return (
    <>
      <TeacherHeader />
      <div className="mt-[120px] px-[150px]">
        <NavigateBack backPage="홈" backLink="/" />
        <Title title="성장일지" />
        <div className="flex flex-row justify-between">
          <div className="rounded-[10px] bg-[#f4f4f4] w-[380px] h-[520px] p-[10px]">
            <div className="bg-[#fff] h-[53px] rounded-[10px] flex items-center p-3 mx-2 mt-2 mb-4">
              <IoSearch className="text-[25px] mr-3" />
              <input
                type="text"
                className="focus:outline-none text-[18px]"
                value={searchChild}
                onChange={handleSearchChange}
                placeholder="이름으로 검색하세요"
              />
            </div>
            <div className="flex flex-wrap w-[360px] h-[420px] overflow-y-auto custom-scrollbar">
              {filteredChildren.map((child) => (
                <div
                  key={child.childId}
                  className={`border-[3px] rounded-[10px] h-[185px] m-1 ${
                    child.childId === currentChildId
                      ? "border-[#B2D170]"
                      : "border-transparent"
                  }`}
                >
                  <GrowthChild
                    key={child.childId}
                    name={child.name}
                    profileImgPath={child.profile}
                    completed={child.completed}
                    onClick={() => handleChildClick(child.childId)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[10px] bg-[#f4f4f4] w-[720px] h-[520px] p-[10px]">
            <div className="flex flex-wrap content-start w-[700px] h-[500px] rounded-[20px] bg-[#f4f4f4] overflow-auto custom-scrollbar p-1">
              <div
                onClick={openCreateModal}
                className="bg-[#fff] rounded-[10px] w-[135px] h-[135px] m-[17px] flex items-center justify-center font-bold text-[18px]"
              >
                <FiPlusCircle className="text-[30px]" />
              </div>
              {growthDiaryData.map((diary) => (
                <GrowthDiaryItem
                  key={diary.diaryId}
                  diaryId={diary.diaryId}
                  createDate={diary.createDate}
                  content={diary.content}
                  images={diary.images}
                  onClick={() => handleDiaryItemClick(diary.diaryId)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal />
      <ToastNotification />
    </>
  );
}

function GrowthDiaryForm({
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

  // Get today's date in YYYY-MM-DD format
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
            max={today} // Set the max attribute to today
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
