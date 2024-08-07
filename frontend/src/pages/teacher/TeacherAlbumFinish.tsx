import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsSend } from 'react-icons/bs';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TeacherHeader from '../../components/teacher/common/TeacherHeader';
import NavigateBack from '../../components/teacher/common/NavigateBack';
import Title from '../../components/teacher/common/Title';
import { sendAlbumToParent } from '../../api/album';
import { transformData } from '../../utils/album';
import { getTeacherInfo } from '../../api/Info';
import { getClassChilds } from '../../api/kindergarten';
import ClassifiedChild from '../../components/teacher/album/ClassifiedChild';
import ChildName from '../../components/teacher/album/ChildName';
import { AlbumItem, Child } from '../../types/album';
import ToastNotification, { showToastError, showToastSuccess } from '../../components/teacher/common/ToastNotification';

export default function TeacherAlbumFinish() {
  const location = useLocation();
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const date = today.getDate().toString().padStart(2, '0');

  const [albumName, setAlbumName] = useState(`${year}년 ${month}월 ${date}일 사진첩`);
  const [result, setResult] = useState<AlbumItem[]>([]);
  const [classChildren, setClassChildren] = useState<Child[]>([]);

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
    let failedCategoryIndex = updatedResult.findIndex(item => item.child === null);
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
    if (res === 'success') {
      showToastSuccess(<div>앨범이 성공적으로 전송되었습니다.</div>);
      navigate('/album/send_finish');
    } else {
      showToastError(<div>전송에 실패했습니다.</div>);
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
          <div className="flex flex-row items-center mb-8 text-[18px]">
            <span className="mr-3 font-bold">앨범 이름</span>
            <input
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              type="text"
              className="border-b-[2px] border-[#363636] w-[290px] px-2 py-0.5 focus:outline-none"
            />
          </div>
          <div className="mb-2 text-[17px]">잘못된 분류가 있나요? 드래그로 수정해보세요</div>
          <div className="flex flex-wrap mb-2 justify-center">
            {classChildren.map((child, index) => (
              <ChildName key={index} child={child} index={index + 1} moveImage={moveImage} />
            ))}
          </div>
          {result.map((item, index) => (
            item.images.length > 0 && (
              <ClassifiedChild key={index} item={item} index={index} moveImage={moveImage} deleteImage={deleteImage} />
            )
          ))}
        </div>
      </div>
      <ToastNotification />
    </DndProvider>
  );
}
