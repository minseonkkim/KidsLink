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
import { ImageItem, AlbumItem, DragItem } from '../../types/album';
import { transformData } from '../../utils/album';
import { getTeacherInfo } from '../../api/Info';
import { getClassChilds } from '../../api/kindergarten';
import ChildName from '../../components/teacher/common/ChildName';

const ItemTypes = {
  IMAGE: 'image',
};

const AlbumChild: React.FC<{
  item: AlbumItem;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number, itemIndex: number, targetItemIndex: number) => void;
  deleteImage: (itemIndex: number, imgIndex: number) => void;
}> = ({ item, index, moveImage, deleteImage }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
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
        <ChildName child={item.child} />
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

const ImageItemComponent: React.FC<{
  image: ImageItem;
  index: number;
  itemIndex: number;
  moveImage: (dragIndex: number, hoverIndex: number, itemIndex: number, targetItemIndex: number) => void;
  deleteImage: (itemIndex: number, imgIndex: number) => void;
}> = ({ image, index, itemIndex, moveImage, deleteImage }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { index, itemIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
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

export default function TeacherAlbumFinish() {
  const location = useLocation();
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const date = today.getDate().toString().padStart(2, '0');

  const [albumName, setAlbumName] = useState(`${year}년 ${month}월 ${date}일의 사진들`);
  const [result, setResult] = useState<AlbumItem[]>(location.state?.sortedResult || []);
  const [classChildren, setClassChildren] = useState<{ name: string }[]>([]);
  console.log(result);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherInfo = await getTeacherInfo();
        const children = await getClassChilds(teacherInfo.kindergartenClassId);
        setClassChildren(children);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

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
                <ChildName key={index} child={child} />
              ))}
            </div>
          {result.map((item, index) => (
            <AlbumChild key={index} item={item} index={index} moveImage={moveImage} deleteImage={deleteImage} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
