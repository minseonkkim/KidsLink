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

export default function TeacherGrowth() {
  const { openModal, Modal, isModalOpen, closeModal } = useModal();
  const [searchChild, setSearchChild] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [growthChildListItems, setGrowthChildListItems] = useState([
    {
      id: 1,
      currentChild: false,
      name: "김민선",
      profileImgPath: ProfileImg,
      completed: true,
    },
    {
      id: 2,
      currentChild: true,
      name: "김범수",
      profileImgPath: ProfileImg,
      completed: false,
    },
    {
      id: 3,
      currentChild: false,
      name: "김민선",
      profileImgPath: ProfileImg,
      completed: false,
    },
    {
      id: 4,
      currentChild: false,
      name: "김민선",
      profileImgPath: ProfileImg,
      completed: true,
    },
    {
      id: 5,
      currentChild: false,
      name: "김민선",
      profileImgPath: ProfileImg,
      completed: true,
    },
    {
      id: 6,
      currentChild: false,
      name: "김민선",
      profileImgPath: ProfileImg,
      completed: true,
    },
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchChild(event.target.value);
  };

  const handlePlusImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return; // If no files were selected, exit the function

      const newImages = files.map((file) => URL.createObjectURL(file));
      setSelectedImages((prevImages) => [...prevImages, ...newImages]);
    } catch (error) {
      console.error("Error selecting images:", error);
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
  };

  const handleDiaryItemClick = (id: number) => {
    setGrowthChildListItems((prevItems) =>
      prevItems.map((child) =>
        child.id === id
          ? { ...child, currentChild: true }
          : { ...child, currentChild: false }
      )
    );
  };

  const renderModalContent = () => (
    <div className="w-[500px]">
    <form>
      <div className="mb-4 flex flex-row items-center">
        <label className="block mr-3 mb-1 font-bold whitespace-nowrap text-[18px]">날짜</label>
        <input
          type="date"
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
    if (!isModalOpen) { // Check if the modal is already open
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
                  onClick={() => handleChildClick(child.id)} // Handle click event
                />
              ))}
            </div>
          </div>
          <div className="rounded-[10px] bg-[#f4f4f4] w-[720px] h-[520px] p-[10px]">
            <div className="flex flex-wrap content-start w-[700px] h-[500px] rounded-[20px] bg-[#f4f4f4] overflow-auto custom-scrollbar p-1">
              <div onClick={openCreateModal} className="bg-[#fff] rounded-[10px] w-[135px] h-[135px] m-[17px] flex items-center justify-center font-bold text-[18px]">
                <FiPlusCircle className="text-[30px]" />
              </div>
              <GrowthDiaryItem id={1} name="김민선" date="2024.07.11" imgPaths={[ExampleImg]} onClick={() => handleDiaryItemClick(1)} />
              <GrowthDiaryItem id={2} name="김민선" date="2024.07.10" imgPaths={[]} onClick={() => handleDiaryItemClick(2)} />
              <GrowthDiaryItem id={3} name="김범수" date="2024.07.09" imgPaths={[]} onClick={() => handleDiaryItemClick(3)} />
              <GrowthDiaryItem id={4} name="김범수" date="2024.07.11" imgPaths={[]} onClick={() => handleDiaryItemClick(4)} />
            </div>
          </div>
        </div>
      </div>
      <Modal />
    </>
  );
}