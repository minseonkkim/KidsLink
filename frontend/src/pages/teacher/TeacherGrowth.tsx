import { useState, useEffect } from "react";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { IoSearch, IoCameraOutline } from "react-icons/io5";
import GrowthChild from "../../components/teacher/growth/GrowthChild";
import ProfileImg from "../../assets/teacher/profile_img.jpg";
import GrowthDiaryItem from "../../components/teacher/growth/GrowthDiaryItem";
import { FiPlusCircle } from "react-icons/fi";
import ExampleImg from "../../assets/teacher/example_img_1.jpg";
import useModal from "../../hooks/teacher/useModal.tsx";
import { FaTrash } from "react-icons/fa";
import ToastNotification, { showToast, showToastError } from '../../components/teacher/common/ToastNotification.tsx';

const initialGrowthDiaryData = [
  { id: 1, childId: 1, name: "김민선", date: "2024.07.10", imgPaths: [ExampleImg] },
  { id: 2, childId: 1, name: "김민선", date: "2024.07.10", imgPaths: [ExampleImg] },
  { id: 3, childId: 1, name: "김민선", date: "2024.07.10", imgPaths: [] },
  { id: 4, childId: 2, name: "김범수", date: "2024.07.09", imgPaths: [] },
  { id: 5, childId: 2, name: "김범수", date: "2024.07.11", imgPaths: [] },
];

export default function TeacherGrowth() {
  const { openModal, Modal, isModalOpen, closeModal } = useModal();
  const [searchChild, setSearchChild] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [growthDiaryData, setGrowthDiaryData] = useState(initialGrowthDiaryData);
  const [growthChildListItems, setGrowthChildListItems] = useState([
    {
      id: 1,
      currentChild: false,
      name: "김민선",
      profileImgPath: ProfileImg,
      completed: false,
    },
    {
      id: 2,
      currentChild: false,
      name: "김범수",
      profileImgPath: ProfileImg,
      completed: false,
    },
    {
      id: 3,
      currentChild: false,
      name: "김여준",
      profileImgPath: ProfileImg,
      completed: false,
    },
    {
      id: 4,
      currentChild: false,
      name: "김지원",
      profileImgPath: ProfileImg,
      completed: false,
    },
    {
      id: 5,
      currentChild: false,
      name: "이상민",
      profileImgPath: ProfileImg,
      completed: false,
    },
    {
      id: 6,
      currentChild: false,
      name: "정현수",
      profileImgPath: ProfileImg,
      completed: false,
    },
  ]);

  useEffect(() => {
    // 매일 자정 completed 상태 초기화
    const resetCompletedStatus = () => {
      setGrowthChildListItems(prevItems =>
        prevItems.map(child => ({ ...child, completed: false }))
      );
    };

    const now = new Date();
    const midnight = new Date(now.setHours(24, 0, 0, 0)).getTime();
    const timeToMidnight = midnight - Date.now();

    // 자정에 한 번 실행한 후, 매일 자정에 실행
    const initialTimeout = setTimeout(() => {
      resetCompletedStatus();
      setInterval(resetCompletedStatus, 24 * 60 * 60 * 1000); // 24시간마다 실행
    }, timeToMidnight);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(initialTimeout);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchChild(event.target.value);
  };

  const handlePlusImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return; // 파일이 선택되지 않은 경우 함수 종료

      const newImages = files.map((file) => URL.createObjectURL(file));
      setSelectedImages((prevImages) => [...prevImages, ...newImages]);
    } catch (error) {
      console.error("이미지 선택 오류:", error);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const filteredChildren = growthChildListItems.filter((child) =>
    child.name.includes(searchChild)
  );

  const handleChildClick = (id: number) => {
    setGrowthChildListItems((prevItems) =>
      prevItems.map((child) =>
        child.id === id
          ? { ...child, currentChild: true }
          : { ...child, currentChild: false }
      )
    );
    setSelectedChildId(id); // 선택된 아이디 저장
  };

  useEffect(() => {
    console.log(`선택된 아이의 ID가 변경되었습니다: ${selectedChildId}`);
  }, [selectedChildId]);

  const handleDiaryItemClick = (id: number) => {
    if (selectedChildId === null) {
      showToast('아이를 선택해주세요');
    } else {
      // 다른 로직 수행
      setSelectedChildId(id); // 선택된 아이디 저장
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedChildId === null) {
      showToastError('아이를 선택해주세요');
      return;
    }

    const selectedChild = growthChildListItems.find((child) => child.id === selectedChildId);
    if (!selectedChild) return;

    const form = event.target as HTMLFormElement;
    const dateValue = form.date.value;
    if (!dateValue) {
      showToastError('날짜를 선택해주세요');
      return;
    }

    console.log(event.target);
    const newDiaryEntry = {
      id: growthDiaryData.length + 1,
      childId: selectedChildId,
      name: selectedChild.name,
      date: dateValue,
      imgPaths: selectedImages,
    };
    selectedChild.completed = true;

    setGrowthDiaryData((prevData) => [...prevData, newDiaryEntry]);
    setSelectedImages([]);
    closeModal();
  };

  const renderModalContent = () => (
    <div className="w-[500px]">
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-row items-center">
          <label className="block mr-3 mb-1 font-bold whitespace-nowrap text-[18px]">날짜</label>
          <input
            type="date"
            name="date"
            className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-[#FDDA6E]"
          />
        </div>
        <div className="mb-4 flex flex-row">
          <label className="block mr-3 mb-1 font-bold whitespace-nowrap text-[18px]">사진</label>
          <label htmlFor="photo">
            <div className="cursor-pointer bg-[#f4f4f4] w-[100px] h-[100px] rounded-[10px] flex items-center justify-center border-[1px]">
              <IoCameraOutline className="text-[40px]" />
            </div>
          </label>
          <input type="file" id="photo" className="hidden" onChange={handlePlusImage} multiple />
          <div className="w-full h-[120px] ml-2 flex flex-row overflow-x-auto whitespace-nowrap custom-x-scrollbar">
            {selectedImages.map((imgSrc, index) => (
              <div key={index} className="w-[100px] h-[100px] relative mr-2 flex-shrink-0">
                <img
                  src={imgSrc}
                  alt={`Selected ${index}`}
                  className="object-cover w-[100px] h-[100px] rounded-[10px] border-[1px]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-1 absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  <FaTrash/>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4 flex flex-row">
          <label className="block mr-3 mb-1 font-bold whitespace-nowrap text-[18px]">기록</label>
          <textarea
            name="record"
            className="border border-gray-300 p-2 rounded w-full"
            rows={8}
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

  useEffect(() => {
    if (isModalOpen) {
      closeModal();
      openModal(renderModalContent());
    }
  }, [selectedImages]);

  const openCreateModal = () => {
    if (selectedChildId === null) {
      showToastError('아이를 선택해주세요');
    } else if (!isModalOpen) {
      openModal(renderModalContent());
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
            <div className="bg-[#fff] h-[53px] rounded-[10px] flex items-center p-3 mx-2 my-3">
              <IoSearch className="text-[25px] mr-3" />
              <input type="text" className="focus:outline-none text-[18px]" value={searchChild} onChange={handleSearchChange} placeholder="이름으로 검색하세요" />
            </div>
            <div className="flex flex-wrap w-[360px] h-[420px] overflow-y-auto custom-scrollbar">
              {filteredChildren.map((child) => (
                <GrowthChild
                  key={child.id}
                  currentChild={child.currentChild}
                  name={child.name}
                  profileImgPath={child.profileImgPath}
                  completed={child.completed}
                  onClick={() => handleChildClick(child.id)} // 클릭 이벤트 핸들러
                />
              ))}
            </div>
          </div>
          <div className="rounded-[10px] bg-[#f4f4f4] w-[720px] h-[520px] p-[10px]">
            <div className="flex flex-wrap content-start w-[700px] h-[500px] rounded-[20px] bg-[#f4f4f4] overflow-auto custom-scrollbar p-1">
              <div onClick={openCreateModal} className="bg-[#fff] rounded-[10px] w-[135px] h-[135px] m-[17px] flex items-center justify-center font-bold text-[18px]">
                <FiPlusCircle className="text-[30px]" />
              </div>
              {growthDiaryData
                .filter((diary) => diary.childId === selectedChildId)
                .map((diary) => (
                  <GrowthDiaryItem
                    key={diary.id}
                    id={diary.id}
                    name={diary.name}
                    date={diary.date}
                    imgPaths={diary.imgPaths}
                    onClick={() => handleDiaryItemClick(diary.id)}
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
