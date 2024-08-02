import React, { useState } from 'react';
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

const ItemTypes = {
  IMAGE: 'image',
};

interface ImageItem {
  path: string;
  imageId: number;
}

interface Child {
  childId: number;  // Changed from string to number
  name: string;
  kindergartenClass: string;
  gender: string;
  birth: string;
  profile: string;
}

interface AlbumItem {
  child: Child | null;
  images: ImageItem[];
}

interface DragItem {
  index: number;
  itemIndex: number;
  type: string;
}

const AlbumChild: React.FC<{
  item: AlbumItem;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number, itemIndex: number, targetItemIndex: number) => void;
  deleteImage: (itemIndex: number, imgIndex: number) => void;
}> = ({ item, index, moveImage, deleteImage }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    hover(draggedItem: DragItem) {
      if (draggedItem.itemIndex === index) return;
      moveImage(draggedItem.index, 0, draggedItem.itemIndex, index);
      draggedItem.itemIndex = index;
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

const ImageItemComponent: React.FC<{
  image: ImageItem;
  index: number;
  itemIndex: number;
  moveImage: (dragIndex: number, hoverIndex: number, itemIndex: number, targetItemIndex: number) => void;
  deleteImage: (itemIndex: number, imgIndex: number) => void;
}> = ({ image, index, itemIndex, moveImage, deleteImage }) => {
  const [, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { index, itemIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    hover(draggedItem: DragItem) {
      if (draggedItem.index === index && draggedItem.itemIndex === itemIndex) return;
      moveImage(draggedItem.index, index, draggedItem.itemIndex, itemIndex);
      draggedItem.index = index;
      draggedItem.itemIndex = itemIndex;
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} className="relative w-full h-32">
      <img src={image.path} className="object-cover w-full h-full rounded-md" />
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
  console.log(result);

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
    updatedResult[itemIndex].images.splice(imgIndex, 1);
    setResult(updatedResult);
  };

  const transformData = () => {
    return result
      .filter((item) => item.child !== null)
      .map((item) => ({
        childId: item.child.childId,
        photos: item.images.map((image) => image.imageId),
      }));
  };

  const navigate = useNavigate();
  
  const sendToParents = async() => {
    const transformedData = transformData();
    const sendData = {
      albumName: albumName,
      taggedPhotos: transformedData,
    };
    console.log(sendData);
    const res = await sendAlbumToParent(sendData);
    if(res === 'success'){
      navigate('/album/send_finish');
    } else{
      // toast.error('전송에 실패했습니다.')
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
          <div className='flex flex-row items-center mb-10 text-[18px]'>
            <span className='mr-3 font-bold'>앨범 이름</span>
            <input
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              type="text"
              className='border-b-[2px] border-[#363636] w-[290px] px-2 py-0.5 focus:outline-none'
            />
          </div>
          <div className="mb-4 text-[17px]">잘못된 분류가 있나요? 드래그로 수정해보세요</div>
          
          {result.map((item, index) => (
            <AlbumChild key={index} item={item} index={index} moveImage={moveImage} deleteImage={deleteImage} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
