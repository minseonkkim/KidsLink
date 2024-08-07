import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FaXmark } from "react-icons/fa6";

export const ScheduleItemType = {
    SCHEDULE_ITEM: 'scheduleItem',
};

export interface ScheduleItemType {
    id: number;
    content: string;
    confirmationStatus: string;
}

interface ScheduleItemProps {
    id: number;
    content: string;
    confirmationStatus: string;
    index: number;
    moveItem: (fromIndex: number, toIndex: number) => void;
    deleteItem: (id: number) => void;
    toggleComplete: (id: number) => void;
}

export default function ScheduleItem({ id, content, confirmationStatus, index, moveItem, deleteItem, toggleComplete }: ScheduleItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [, drop] = useDrop({
        accept: ScheduleItemType.SCHEDULE_ITEM,
        hover: (draggedItem: { index: number }) => {
            if (draggedItem.index !== index) {
                moveItem(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ScheduleItemType.SCHEDULE_ITEM,
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    // drag(drop(ref));  // 주석 해제하면 드래그앤드롭 할수있음

    return (
        <div
            ref={ref}
            className={`flex flex-row m-2 items-center ${isDragging ? 'opacity-50' : ''}`}
        >
            <input
                type="checkbox"
                className="mr-2 w-[19px] h-[19px] accent-[#757575]"
                checked={confirmationStatus === "T"}
                disabled={confirmationStatus === "T"}
                onChange={() => toggleComplete(id)}
            />
            <p className={`${confirmationStatus === "T" ? 'text-[#B8B8B8]' : ''} text-[18px] flex-grow`}>{content}</p>
            <button onClick={() => deleteItem(id)} className="text-red-500 hover:text-red-700">
                <FaXmark />
            </button>
        </div>
    );
}