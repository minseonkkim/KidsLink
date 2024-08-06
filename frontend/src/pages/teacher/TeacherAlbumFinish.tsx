import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsSend } from 'react-icons/bs';
import { FaTrash } from 'react-icons/fa6';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TeacherHeader from '../../components/teacher/common/TeacherHeader';
import NavigateBack from '../../components/teacher/common/NavigateBack';
import Title from '../../components/teacher/common/Title';
import { sendAlbumToParent } from '../../api/album';
import { showToast, showToastError } from '../../components/teacher/common/ToastNotification';
import { ImageItem, AlbumItem, DragItem, Child } from '../../types/album';
import { transformData } from '../../utils/album';
import { getTeacherInfo } from '../../api/Info';
import { getClassChilds } from '../../api/kindergarten';

// 개별 이미지 컴포넌트
const ImageItemComponent: React.FC<{
  image: ImageItem;
  index: number;
  itemIndex: number;
  moveImage: (dragIndex: number, hoverIndex: number, itemIndex: number, targetItemIndex: number) => void;
  deleteImage: (itemIndex: number, imgIndex: number) => void;
}> = ({ image, index, itemIndex, moveImage, deleteImage }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'image',
    item: { index, itemIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'image',
    hover(draggedItem: DragItem) {
      if (draggedItem.index !== index || draggedItem.itemIndex !== itemIndex) {
        moveImage(draggedItem.index, index, draggedItem.itemIndex, itemIndex);
        draggedItem.index = index;
        draggedItem.itemIndex = itemIndex;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`relative w-full h-32 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {image?.path ? (
        <img
          src={image.path}
          className="object-cover w-full h-full rounded-md"
          alt="item"
        />
      ) : (
        <div className="object-cover w-full h-full rounded-md bg-gray-200 flex items-center justify-center">
          이미지 없음
        </div>
      )}
      <button
        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
        onClick={() => deleteImage(itemIndex, index)}
      >
        <FaTrash />
      </button>
    </div>
  );
};

// 각 아이의 이름을 표시하는 컴포넌트
const ChildName: React.FC<{
  child: Child | null;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number, itemIndex: number, targetItemIndex: number) => void;
}> = ({ child, index, moveImage }) => {
  const [{ canDrop, isOverCurrent }, drop] = useDrop({
    accept: 'image',
    drop: (draggedItem: DragItem) => {
      moveImage(draggedItem.index, 0, draggedItem.itemIndex, index);
    },
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = canDrop && isOverCurrent;

  return (
    <div
      ref={drop}
      className={`cursor-pointer flex items-center justify-center rounded-[30px] w-[95px] h-[45px] font-bold mx-3 my-2 text-[17px] transition-colors duration-300 ${
        isActive
          ? 'bg-[#8CAD1E] text-[#fff]'
          : canDrop
          ? 'bg-[#EAEAEA] text-[#363636]'
          : 'bg-[#EAEAEA] text-[#363636]'
      }`}
      style={{ minWidth: '120px' }}
    >
      {child ? child.name : '분류실패'}
    </div>
  );
};

// 앨범 내 아이와 이미지를 관리하는 컴포넌트
const AlbumChild: React.FC<{
  item: AlbumItem;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number, itemIndex: number, targetItemIndex: number) => void;
  deleteImage: (itemIndex: number, imgIndex: number) => void;
}> = ({ item, index, moveImage, deleteImage }) => {
  const [, drop] = useDrop({
    accept: 'image',
    hover(draggedItem: DragItem) {
      if (draggedItem.itemIndex !== index) {
        moveImage(draggedItem.index, 0, draggedItem.itemIndex, index);
        draggedItem.index = 0;
        draggedItem.itemIndex = index;
      }
    },
  });

  return (
    <div ref={drop} className="w-full mb-4">
      <div className="flex flex-row w-full">
        <span
          className={`${
            item.child ? 'bg-[#8CAD1E] text-[#fff]' : 'bg-[#EAEAEA] text-[#363636]'
          } cursor-pointer flex items-center justify-center rounded-[30px] w-[95px] h-[45px] font-bold mx-3 my-2 text-[17px]`}
        >
          {item.child ? item.child.name : '분류실패'}
        </span>
        <div
          className={`${
            item.child ? 'border-[#8CAD1E]' : 'bg-[#EAEAEA]'
          } p-3 mb-2 w-full grid grid-cols-7 gap-4 overflow-y-auto rounded-[10px] border-[1px]`}
        >
          {item.images.map((image, imgIndex) => (
            <ImageItemComponent
              key={imgIndex}
              image={image}
              index={imgIndex}
              itemIndex={index}
              moveImage={moveImage}
              deleteImage={deleteImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// 메인 컴포넌트
export default function TeacherAlbumFinish() {
  const location = useLocation();
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const date = today.getDate().toString().padStart(2, '0');

  // 앨범 이름 상태 관리
  const [albumName, setAlbumName] = useState(`${year}년 ${month}월 ${date}일의 사진들`);
  // 분류된 결과 상태 관리
  const [result, setResult] = useState<AlbumItem[]>([]);
  // 반 아이들 상태 관리
  const [classChildren, setClassChildren] = useState<Child[]>([]);

  // 초기화 작업
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherInfo = await getTeacherInfo();
        const children = await getClassChilds(teacherInfo.kindergartenClassId);
        children.sort((a, b) => a.name.localeCompare(b.name));
        console.log(children)
        setClassChildren(children);

        // 아이들 배열 초기화
        const initialResult: AlbumItem[] = [{ child: null, images: [] }];
        children.forEach((child) => {
          initialResult.push({ child, images: [] });
        });

        // sortedResult에서 아이들 결과 업데이트
        const sortedResult = location.state?.sortedResult || [];
        sortedResult.forEach((sortedItem) => {
          console.log(sortedItem)
          if (!sortedItem.child) {
            initialResult[0].images = initialResult[0].images.concat(sortedItem.images);
          } else {
            const childIndex = initialResult.findIndex(
              (item) => item.child && item.child.childId === sortedItem.child.childId
            );
            initialResult[childIndex].images = sortedItem.images;
          }
        });
        console.log(initialResult)

        setResult(initialResult);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [location.state]);

  // 이미지 이동 함수
  const moveImage = (
    dragIndex: number,
    hoverIndex: number,
    itemIndex: number,
    targetItemIndex: number
  ) => {
    const updatedResult = [...result];
    const draggedImage = updatedResult[itemIndex].images[dragIndex];

    // 기존 위치에서 이미지 제거
    updatedResult[itemIndex].images.splice(dragIndex, 1);
    // 새 위치에 이미지 삽입
    updatedResult[targetItemIndex].images.splice(hoverIndex, 0, draggedImage);

    setResult(updatedResult);
  };

  // 이미지 삭제 함수
  const deleteImage = (itemIndex: number, imgIndex: number) => {
    const updatedResult = [...result];
    const draggedImage = updatedResult[itemIndex].images[imgIndex];

    // 기존 위치에서 이미지 제거
    updatedResult[itemIndex].images.splice(imgIndex, 1);

    // '분류실패' 카테고리가 있는지 확인, 없으면 추가
    let failedCategoryIndex = updatedResult.findIndex(item => item.child === null);
    if (failedCategoryIndex === -1) {
      updatedResult.push({ child: null, images: [] });
      failedCategoryIndex = updatedResult.length - 1;
    }

    // '분류실패' 카테고리에 이미지 추가
    updatedResult[failedCategoryIndex].images.push(draggedImage);
    
    setResult(updatedResult);
  };

  // 학부모에게 전송하는 함수
  const navigate = useNavigate();
  const sendToParents = async () => {
    const transformedData = transformData(result);
    const sendData = {
      albumName: albumName,
      taggedPhotos: transformedData,
    };
    console.log(sendData);
    const res = await sendAlbumToParent(sendData);
    if (res === 'success') {
      navigate('/album/send_finish');
    } else {
      // showToastError('전송에 실패했습니다.')
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <TeacherHeader />
      <div className="mt-[120px] px-[150px]">
        <NavigateBack backPage="홈" backLink="/" />
        <Title title="사진분류" />
        <button
          onClick={sendToParents}
          className="absolute top-[125px] right-[150px] border-[2px] border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA] flex flex-row items-center"
        >
          <BsSend className="mr-2" />
          학부모에게 전송하기
        </button>
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center mb-10 text-[18px]">
            <span className="mr-3 font-bold">앨범 이름</span>
            <input
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              type="text"
              className="border-b-[2px] border-[#363636] w-[290px] px-2 py-0.5 focus:outline-none"
            />
          </div>
          <div className="mb-4 text-[17px]">잘못된 분류가 있나요? 드래그로 수정해보세요</div>
          <div className="flex flex-wrap">
            {classChildren.map((child, index) => (
              <ChildName key={index} child={child} index={index + 1} moveImage={moveImage} />
            ))}
          </div>
          {result.map((item, index) => (
            item.images.length > 0 && (
              <AlbumChild key={index} item={item} index={index} moveImage={moveImage} deleteImage={deleteImage} />
            )
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
