import React from 'react';
import { useDrop } from 'react-dnd';
import { AlbumItem, DragItem } from '../../../types/album';
import ImageItemComponent from '../album/ImageItemComponent';

interface ClassifiedChildProps {
  item: AlbumItem;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number, itemIndex: number, targetItemIndex: number) => void;
  deleteImage: (itemIndex: number, imgIndex: number) => void;
}

export default function ClassifiedChild({ item, index, moveImage, deleteImage }: ClassifiedChildProps) {
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

  const isFailedCategory = item.child === null; // Check if the category is "분류실패"

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
              isFailedCategory={isFailedCategory}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
