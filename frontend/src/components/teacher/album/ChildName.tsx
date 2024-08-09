import { useDrop } from 'react-dnd';

interface Child {
  name: string;
}

interface DragItem {
  index: number;
  itemIndex: number;
}

interface ChildNameProps {
  child: Child | null;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number, itemIndex: number, targetItemIndex: number) => void;
}

export default function ChildName({ child, index, moveImage }: ChildNameProps) {
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
      style={{ minWidth: '120px', zIndex: 9999 }} // Ensure ChildName is above the overlay
    >
      {child ? child.name : '분류실패'}
    </div>
  );
}
