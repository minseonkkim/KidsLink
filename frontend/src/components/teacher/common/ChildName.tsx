import React from 'react';
import { useDrop } from 'react-dnd';
import { DragItem } from '../../../types/album';

interface ChildNameProps {
  child: { name: string } | null;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number, itemIndex: number, targetItemIndex: number) => void;
}

const ChildName: React.FC<ChildNameProps> = ({ child, index, moveImage }) => {
  const [, drop] = useDrop({
    accept: 'image',
    drop: (draggedItem: DragItem) => {
      moveImage(draggedItem.index, 0, draggedItem.itemIndex, index);
    },
  });

  return (
    <div ref={drop} className={`p-2 m-2 ${child ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'} rounded`}>
      {child ? child.name : '분류실패'}
    </div>
  );
};

export default ChildName;
