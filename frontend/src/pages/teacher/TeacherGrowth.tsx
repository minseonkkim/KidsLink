import React, { useState, useEffect } from "react";
import NavigateBack from "../../components/teacher/common/NavigateBack.tsx";
import TeacherHeader from "../../components/teacher/common/TeacherHeader.tsx";
import Title from "../../components/teacher/common/Title.tsx";
import { IoSearch, IoCameraOutline } from "react-icons/io5";
import GrowthChild from "../../components/teacher/growth/GrowthChild.tsx";
import GrowthDiaryItem from "../../components/teacher/growth/GrowthDiaryItem.tsx";
import { FiPlusCircle } from "react-icons/fi";
import useModal from "../../hooks/teacher/useModal.tsx";
import ToastNotification, { showToast, showToastError } from "../../components/teacher/common/ToastNotification.tsx";
import { useTeacherInfoStore } from "../../stores/useTeacherInfoStore.ts";
import { getClassChilds } from "../../api/kindergarten.ts";
import { getKidAllGrowthDiarys } from "../../api/growthdiary.ts";
import GrowthDiaryForm from "../../components/teacher/growth/GrowthDiaryForm.tsx";
import { getTeacherInfo } from "../../api/Info.ts";

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
    const fetchChilds = async (classId: number) => {
      try {
        const fetchedChilds = await getClassChilds(classId);
        await checkChildCompletion(fetchedChilds);
      } catch (error) {
        console.error("Failed to fetch childs:", error);
      }
    };

    const teacherInfo = useTeacherInfoStore.getState().teacherInfo;

    if (!teacherInfo) {
      getTeacherInfo()
        .then((data) => {
          useTeacherInfoStore.setState({ teacherInfo: data });
          fetchChilds(data.kindergartenClassId);
        })
        .catch((error) => {
          console.error("Failed to fetch teacher info:", error);
        });
    } else {
      fetchChilds(teacherInfo.kindergartenClassId);
    }
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
      <div className="mt-[120px] px-[20px] lg:px-[150px]">
        <NavigateBack backPage="홈" backLink="/" />
        <Title title="성장일지" />
        <div className="flex flex-col lg:flex-row justify-between">
          <div className="rounded-[10px] bg-[#f4f4f4] w-full lg:w-[380px] h-[325px] lg:h-[520px] p-[10px] mb-4 lg:mb-0">
            <div className="bg-[#fff] lg:h-[53px] h-[46px] rounded-[10px] flex items-center p-3 mx-2 mt-2 mb-4">
              <IoSearch className="text-[25px] mr-3" />
              <input
                type="text"
                className="focus:outline-none text-[18px]"
                value={searchChild}
                onChange={handleSearchChange}
                placeholder="이름으로 검색하세요"
              />
            </div>
            <div className="flex flex-wrap w-full lg:w-[360px] h-[230px] lg:h-[420px] overflow-y-auto custom-scrollbar">
              {filteredChildren.map((child) => (
                <div
                  key={child.childId}
                  className={`border-[3px] rounded-[10px] h-[181px] m-1 ${
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
          <div className="rounded-[10px] bg-[#f4f4f4] w-full lg:w-[720px] lg:h-[520px] h-[380px] p-[10px]">
            <div className="flex flex-wrap content-start w-full lg:w-[700px] lg:h-[500px] h-[360px] rounded-[20px] bg-[#f4f4f4] overflow-auto custom-scrollbar p-1">
              <div
                onClick={openCreateModal}
                className="bg-[#fff] rounded-[10px] w-[133px] h-[133px] lg:m-[17px] m-[15px] flex items-center justify-center font-bold text-[18px]"
              >
                <FiPlusCircle className="text-[30px]" />
              </div>
              {growthDiaryData.map((diary) => (
                <GrowthDiaryItem
                  key={diary.diaryId}
                  diaryId={diary.diaryId}
                  createDate={diary.createDate}
                  content={diary.content}
                  thumbnail={diary.thumbnail}
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
