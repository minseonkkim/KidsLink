import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BsSend } from "react-icons/bs";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Title from "../../components/teacher/common/Title";
import ClassifiedChild from "../../components/teacher/album/ClassifiedChild";
import ChildName from "../../components/teacher/album/ChildName";
import { AlbumItem, Child } from "../../types/album";
import ToastNotification, {
  showToastError,
  showToastSuccess,
} from "../../components/teacher/common/ToastNotification";
import { useDragLayer } from "react-dnd";
import TeacherLayout from "../../layouts/TeacherLayout";
import daramgi from "../../assets/teacher/camera-daramgi.png";
import { getTeacherInfo } from "../../api/Info";
import { getClassChilds } from "../../api/kindergarten";
import { transformData } from "../../utils/album";
import { sendAlbumToParent } from "../../api/album";

export function DragOverlay() {
  const { isDragging, currentOffset, item } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
    item: monitor.getItem(),
  }));

  if (!isDragging || !item || !currentOffset) {
    return null;
  }

  const transform = `translate(${currentOffset.x}px, ${currentOffset.y}px)`;

  return (
    <>
      {/* 어두운 배경 레이어 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          zIndex: 1500, // ChildNameContainer보다 낮게 설정
          pointerEvents: 'none',
        }}
      />

      {/* 드래그된 이미지 */}
      <div
        style={{
          transform,
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 2500, // ChildNameContainer보다 높게 설정
          pointerEvents: 'none',
          width: '150px',
          height: '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.65)',
          backgroundColor: '#fff',
        }}
      >
        {item.image && (
          <img
            src={item.image.path}
            alt="dragged"
            className="object-cover"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
            }}
          />
        )}
      </div>
    </>
  );
}


export function ChildNameContainer({ classChildren, moveImage }) {
  const { isDragging } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
  }));

  return (
    <div
      className="flex flex-wrap mb-2 justify-center"
      style={{
        position: 'fixed',
        top: '18%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: isDragging ? 'flex' : 'none',
        zIndex: 2000, // DragOverlay의 어두운 배경보다 높게, 드래그 이미지보다 낮게 설정
      }}
    >
      {classChildren.map((child, index) => (
        <ChildName key={index} child={child} index={index + 1} moveImage={moveImage} />
      ))}
    </div>
  );
}


export default function TeacherAlbumFinish() {
  const location = useLocation();
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const date = today.getDate().toString().padStart(2, "0");

  const [albumName, setAlbumName] = useState(`${year}년 ${month}월 ${date}일 사진첩`);
  const [result, setResult] = useState<AlbumItem[]>([]);
  const [classChildren, setClassChildren] = useState<Child[]>([]);

  useEffect(() => {
    const savedResult = JSON.parse(localStorage.getItem("result") || "[]");
    if (savedResult.length > 0) {
      setResult(savedResult);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherInfo = await getTeacherInfo();
        const children = await getClassChilds(teacherInfo.kindergartenClassId);
        children.sort((a, b) => a.name.localeCompare(b.name));
        setClassChildren(children);

        const initialResult: AlbumItem[] = [{ child: null, images: [] }];
        children.forEach((child) => {
          initialResult.push({ child, images: [] });
        });

        const sortedResult = location.state?.sortedResult || [];
        sortedResult.forEach((sortedItem) => {
          if (!sortedItem.child) {
            initialResult[0].images = initialResult[0].images.concat(sortedItem.images);
          } else {
            const childIndex = initialResult.findIndex(
              (item) => item.child && item.child.childId === sortedItem.child.childId
            );
            initialResult[childIndex].images = sortedItem.images;
          }
        });

        setResult(initialResult);
      } catch (error) {
        console.error(error);
        showToastError(<div>데이터를 가져오는 데 실패했습니다.</div>);
      }
    };
    fetchData();
  }, [location.state]);

  useEffect(() => {
    // Save data to local storage
    if (result.length > 0) {
      localStorage.setItem("result", JSON.stringify(result));
    }
  }, [result]);

  const moveImage = (
    dragIndex: number,
    hoverIndex: number,
    itemIndex: number,
    targetItemIndex: number
  ) => {
    const updatedResult = [...result];
    const draggedImage = updatedResult[itemIndex].images[dragIndex];
    updatedResult[itemIndex].images.splice(dragIndex, 1);
    updatedResult[targetItemIndex].images.splice(hoverIndex, 0, draggedImage);
    setResult(updatedResult);
  };

  const deleteImage = (itemIndex: number, imgIndex: number) => {
    const updatedResult = [...result];
    const draggedImage = updatedResult[itemIndex].images[imgIndex];
    updatedResult[itemIndex].images.splice(imgIndex, 1);
    let failedCategoryIndex = updatedResult.findIndex((item) => item.child === null);
    if (failedCategoryIndex === -1) {
      updatedResult.push({ child: null, images: [] });
      failedCategoryIndex = updatedResult.length - 1;
    }
    updatedResult[failedCategoryIndex].images.push(draggedImage);
    setResult(updatedResult);
  };

  const navigate = useNavigate();
  const sendToParents = async () => {
    if (!albumName.trim()) {
      showToastError(<div>앨범 이름을 작성해주세요</div>);
      return;
    }

    const transformedData = transformData(result);
    const sendData = {
      albumName: albumName,
      taggedPhotos: transformedData,
    };
    const res = await sendAlbumToParent(sendData);
    if (res === "success") {
      showToastSuccess(<div>앨범이 성공적으로 전송되었습니다.</div>);
      navigate("/album/send_finish");
    } else {
      showToastError(<div>전송에 실패했습니다.</div>);
    }
  };

  const tabs = [
    { label: "사진분류", link: "/album" },
    { label: "전송내역", link: "/album/history" },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <TeacherLayout
        activeMenu="album"
        setActiveMenu={() => {}}
        titleComponent={<Title title="사진분류완료" />}
        tabs={tabs}
        imageSrc={daramgi}
      >
        <DragOverlay />
        <div className="px-[15px] mb-[130px] mt-10">
          <div className="flex flex-col items-center">
            <div className="flex lg:flex-row flex-col items-center justify-between w-full px-[18px] mb-5">
              <div className="flex flex-row items-center mb-3 text-[18px]">
                <span className="mr-3 font-bold whitespace-nowrap">앨범 이름</span>
                <input
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                  type="text"
                  className="border-b-[2px] border-[#363636] w-[220px] px-2 py-0.5 focus:outline-none"
                />
              </div>
              <button
                onClick={sendToParents}
                className="border-[2px] border-[#7C7C7C] bg-[#E3EEFF] px-4 w-[192px] h-[38px] font-bold rounded-[10px] hover:bg-[#D4DDEA] flex flex-row items-center"
              >
                <BsSend className="mr-2" />
                학부모에게 전송하기
              </button>
            </div>
            <div className="mb-5 lg:text-[17px] text-[16px]">
              잘못된 분류가 있나요? 드래그로 수정해보세요
            </div>
            <ChildNameContainer classChildren={classChildren} moveImage={moveImage} />

            {result.map(
              (item, index) =>
                item.images.length > 0 && (
                  <ClassifiedChild
                    key={index}
                    item={item}
                    index={index}
                    moveImage={moveImage}
                    deleteImage={deleteImage}
                  />
                )
            )}
          </div>
        </div>
        <ToastNotification />
      </TeacherLayout>
    </DndProvider>
  );
}
