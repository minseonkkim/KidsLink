import React, { useState, useCallback, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import moment from "moment";
import { FaRegCalendar } from "react-icons/fa6";
import { createTeacherSchedule, createTeacherScheduleCheck, deleteTeacherSchedule, getTeacherSchedules } from "../../api/schedule";
import StyledCalendar from "../../components/teacher/common/StyledCalendar";
import ScheduleItem, { ScheduleItemType } from "../../components/teacher/schedule/ScheduleItem";

export default function TeacherSchedule() {
    const [date, setDate] = useState(new Date());
    const [scheduleItems, setScheduleItems] = useState<ScheduleItemType[]>([]);
    const [time, setTime] = useState('');
    const [todo, setTodo] = useState('');

    const fetchSchedules = async () => {
        try {
            const fetchedSchedules = (await getTeacherSchedules(formatDate(date))).teacherSchedules;
            fetchedSchedules.sort((a, b) => {
                if (a.confirmationStatus === "T" && b.confirmationStatus !== "T") return -1;
                if (a.confirmationStatus !== "T" && b.confirmationStatus === "T") return 1;
                const isANumeric = /^\d/.test(a.content);
                const isBNumeric = /^\d/.test(b.content);
                if (isANumeric && !isBNumeric) return -1;
                if (!isANumeric && isBNumeric) return 1;
                if (a.content < b.content) return -1;
                if (a.content > b.content) return 1;
                return 0;
            });
            setScheduleItems(fetchedSchedules);
        } catch (error) {
            console.error("Failed to fetch schedules:", error);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, [date]);

    const formatDate = (date) => {
        if (date instanceof Date) {
            return moment(date).format("YYYY-MM-DD");
        }
        return '';
    };

    const deleteItem = async (id) => {
        await deleteTeacherSchedule(id);
        fetchSchedules();
    };

    const moveItem = useCallback((fromIndex, toIndex) => {
        const updatedItems = [...scheduleItems];
        const [movedItem] = updatedItems.splice(fromIndex, 1);
        updatedItems.splice(toIndex, 0, movedItem);
        setScheduleItems(updatedItems);
    }, [scheduleItems]);

    const handleAddScheduleItem = async () => {
        const scheduleData = {
            date: formatDate(date),
            content: time + ' ' + todo,
        };

        try {
            await createTeacherSchedule(scheduleData);
            fetchSchedules();
            setTime('');
            setTodo('');
        } catch (error) {
            console.error('Failed to create notice:', error);
        }
    };

    const toggleComplete = async (id) => {
        await createTeacherScheduleCheck(id);
        fetchSchedules();
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <TeacherHeader />
            <div className="flex flex-col mt-[90px]">
                <NavigateBack backPage="홈" backLink='/' />
                <Title title="일정" />
                <div className="px-[150px] mt-5 flex flex-row justify-between items-center mt-10">
                    <StyledCalendar
                        onChange={setDate}
                        value={date}
                        formatDay={(locale, date) => date.toLocaleString("en", { day: "numeric" })}
                        next2Label={null}
                        prev2Label={null}
                    />
                    <div className="w-[637px]">
                        <div className="flex flex-row justify-between mb-2">
                            <div className="text-[22px] flex flex-row items-center h-[22px] font-bold text-[#8CAD1E] my-2">
                                <FaRegCalendar className="mr-3" />
                                {formatDate(date)}
                            </div>
                        </div>
                        <div className="border-[2px] border-[#8CAD1E] rounded-[10px] h-[330px]">
                            <div className="overflow-y-auto custom-scrollbar h-[310px] m-[10px]">
                                {scheduleItems.length === 0 ? (
                                    <div className="flex justify-center items-center h-[310px]">
                                        일정이 없어요.
                                    </div>
                                ) : (
                                    scheduleItems.map(({ id, content, confirmationStatus }, index) => (
                                        <ScheduleItem
                                            key={id}
                                            id={id}
                                            content={content}
                                            confirmationStatus={confirmationStatus}
                                            index={index}
                                            moveItem={moveItem}
                                            deleteItem={deleteItem}
                                            toggleComplete={toggleComplete}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center mt-3">
                            <input
                                className="border w-[150px] h-[40px] border-[2px] border-[#B8B8B8] mr-1 rounded-[10px] p-1"
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                            <input
                                className="border w-[580px] h-[40px] bg-[#F8F8F8] border-[2px] rounded-[10px] border-[#B8B8B8] mr-1 p-1"
                                type="text"
                                value={todo}
                                onChange={(e) => setTodo(e.target.value)}
                            />
                            <button
                                className="font-bold border-[2px] border-[#B8B8B8] text-[#B8B8B8] w-[65px] h-[40px] rounded-[10px] hover:bg-[#F3F3F3]"
                                onClick={handleAddScheduleItem}
                            >
                                추가
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

