import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ImageItem, DragItem } from '../../../types/album';
import { FaMinusCircle } from 'react-icons/fa';

interface ImageItemComponentProps {
  image: ImageItem;
  index: number;
  itemIndex: number;
  moveImage: (dragIndex: number, hoverIndex: number, itemIndex: number, targetItemIndex: number) => void;
  deleteImage: (itemIndex: number, imgIndex: number) => void;
}

export default function ImageItemComponent({ image, index, itemIndex, moveImage, deleteImage }: ImageItemComponentProps) {
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
        className="absolute top-1 right-1 bg-red-600 text-white p-[2px] rounded-full"
        onClick={() => deleteImage(itemIndex, index)}
      >
        <FaMinusCircle size={18} />
      </button>
    </div>
  );
}
