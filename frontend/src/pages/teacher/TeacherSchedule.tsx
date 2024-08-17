import { useState, useCallback, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaRegCalendar, FaXmark } from "react-icons/fa6";
import Title from "../../components/teacher/common/Title";
import TeacherLayout from "../../layouts/TeacherLayout";
import { formatDate, formatSendDate } from "../../utils/teacher/formatDate";
import {
  createTeacherSchedule,
  createTeacherScheduleCheck,
  deleteTeacherSchedule,
  getTeacherSchedules,
} from "../../api/schedule";
import StyledCalendar from "../../components/teacher/common/StyledCalendar";
import { getOneParentInfo } from "../../api/info";
import daramgi from "../../assets/teacher/daramgi.png";

const ItemType = {
  SCHEDULE_ITEM: "scheduleItem",
};

interface ScheduleItemType {
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

interface MeetingItemProps {
  meetingId: number;
  meetingDate: string;
  meetingTime: string;
  parentId: number;
  teacherId: number;
  childName?: string;
}

interface KindergartenItemType {
  id: number;
  content: string;
  date: string;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({
  id,
  content,
  confirmationStatus,
  index,
  moveItem,
  deleteItem,
  toggleComplete,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: ItemType.SCHEDULE_ITEM,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.SCHEDULE_ITEM,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={ref}
      className={`flex flex-row m-2 items-center ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <input
        type="checkbox"
        className="mr-2 w-[19px] h-[19px] accent-[#757575]"
        checked={confirmationStatus === "T"}
        disabled={confirmationStatus === "T"}
        onChange={() => toggleComplete(id)}
      />
      <p
        className={`${
          confirmationStatus === "T" ? "text-[#B8B8B8] line-through" : ""
        } text-[18px] flex-grow`}
      >
        {content}
      </p>
      <button
        onClick={() => deleteItem(id)}
        className="text-red-500 hover:text-red-700"
      >
        <FaXmark />
      </button>
    </div>
  );
};

type ValuePiece = Date | null;

export default function TeacherSchedule() {
  const [date, setDate] = useState<ValuePiece | [ValuePiece, ValuePiece]>(
    new Date()
  );
  const [scheduleItems, setScheduleItems] = useState<ScheduleItemType[]>([]);
  const [meetingItems, setMeetingItems] = useState<MeetingItemProps[]>([]);
  const [kindergartenScheduleItems, setKindergartenScheduleItems] = useState<
    KindergartenItemType[]
  >([]);
  const [time, setTime] = useState("");
  const [todo, setTodo] = useState("");

  const fetchTeacherSchedules = async () => {
    try {
      const fetchedSchedules = (await getTeacherSchedules(formatSendDate(date)))
        .teacherSchedules;
      fetchedSchedules.sort((a, b) => {
        if (a.confirmationStatus === "T" && b.confirmationStatus !== "T")
          return -1;
        if (a.confirmationStatus !== "T" && b.confirmationStatus === "T")
          return 1;
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

  const fetchMeetingSchedules = async () => {
    try {
      const fetchedMeetings: MeetingItemProps[] = (
        await getTeacherSchedules(formatSendDate(date))
      ).meetingSchedules;

      fetchedMeetings.sort((a, b) => {
        const [hoursA, minutesA] = a.meetingTime.split(":").map(Number);
        const [hoursB, minutesB] = b.meetingTime.split(":").map(Number);

        const timeA = new Date(0, 0, 0, hoursA, minutesA);
        const timeB = new Date(0, 0, 0, hoursB, minutesB);

        return timeA.getTime() - timeB.getTime();
      });

      for (let i = 0; i < fetchedMeetings.length; i++) {
        const parentId = fetchedMeetings[i].parentId;
        if (parentId) {
          const parentInfo = await getOneParentInfo(parentId);
          fetchedMeetings[i].childName = parentInfo.child.name;
        }
      }
      setMeetingItems(fetchedMeetings);
    } catch (error) {
      console.error("Failed to fetch meeting schedules:", error);
    }
  };

  const fetchKindergartenSchedules = async () => {
    try {
      const fetchedKindergartenSchedules: KindergartenItemType[] = (
        await getTeacherSchedules(formatSendDate(date))
      ).kindergartenSchedules;
      setKindergartenScheduleItems(fetchedKindergartenSchedules);
    } catch (error) {
      console.error("Failed to fetch kindergarten schedules:", error);
    }
  };

  useEffect(() => {
    fetchTeacherSchedules();
    fetchMeetingSchedules();
    fetchKindergartenSchedules();
  }, [date]);

  const deleteItem = async (id: number) => {
    await deleteTeacherSchedule(id);
    fetchTeacherSchedules();
  };

  const moveItem = useCallback(
    (fromIndex: number, toIndex: number) => {
      const updatedItems = [...scheduleItems];
      const [movedItem] = updatedItems.splice(fromIndex, 1);
      updatedItems.splice(toIndex, 0, movedItem);
      setScheduleItems(updatedItems);
    },
    [scheduleItems]
  );

  const handleAddScheduleItem = async () => {
    const scheduleData = {
      date: formatSendDate(date),
      content: time + " " + todo,
    };

    try {
      await createTeacherSchedule(scheduleData);
      fetchTeacherSchedules();
      setTime("");
      setTodo("");
    } catch (error) {
      console.error("Failed to create notice:", error);
    }
  };

  const toggleComplete = async (id: number) => {
    await createTeacherScheduleCheck(id);
    fetchTeacherSchedules();
  };

  const isFutureMeeting = (meetingDate: string, meetingTime: string) => {
    const meetingDateTime = new Date(`${meetingDate}T${meetingTime}`);
    const now = new Date();
    return meetingDateTime > now;
  };

  return (
    <TeacherLayout
      activeMenu="schedule"
      setActiveMenu={() => {}}
      titleComponent={<Title title="일정관리" />}
      imageSrc={daramgi}
    >
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col w-full lg:mt-[70px] mt-5 px-5">
          <div className="mt-5 flex flex-col lg:flex-row justify-between items-center mt-10 space-y-4 lg:space-y-0 lg:space-x-16">
            <StyledCalendar
              onChange={setDate}
              value={date}
              formatDay={(locale: string, date: Date) =>
                date.toLocaleString("en", { day: "numeric" })
              }
              next2Label={null}
              prev2Label={null}
            />
            <div className="w-full lg:w-[637px]">
              <div className="flex flex-row justify-between mb-2">
                <div className="text-[22px] flex flex-row items-center h-[22px] font-bold text-[#8CAD1E] my-2">
                  <FaRegCalendar className="mr-3" />
                  {formatDate(date)}
                </div>
              </div>
              <div className="border-[2px] border-[#8CAD1E] rounded-[10px] h-[270px] lg:h-[330px]">
                <div className="overflow-y-auto custom-scrollbar h-[310px] m-[10px]">
                  {scheduleItems.length === 0 &&
                  meetingItems.length === 0 &&
                  kindergartenScheduleItems.length === 0 ? (
                    <div className="flex justify-center items-center lg:h-[310px] h-[250px]">
                      일정이 없어요.
                    </div>
                  ) : (
                    <>
                      {kindergartenScheduleItems.length !== 0 && (
                        <div className="mb-3">
                          <div className="font-bold text-[18px] m-1">
                            학사일정
                          </div>
                          {kindergartenScheduleItems.map((item, index) => (
                            <div
                              key={item.id}
                              className={"mx-1 my-3 text-[18px]"}
                            >
                              {item.content}
                            </div>
                          ))}
                          {meetingItems.length !== 0 ||
                            (scheduleItems.length !== 0 && <hr />)}
                        </div>
                      )}
                      {meetingItems.length !== 0 && (
                        <div className="mb-3">
                          <div className="font-bold text-[18px] m-1">
                            화상상담
                          </div>
                          {meetingItems.map((item, index) => (
                            <div
                              key={item.meetingId}
                              className={`mx-1 my-3 text-[18px] ${
                                isFutureMeeting(
                                  item.meetingDate,
                                  item.meetingTime
                                )
                                  ? "text-[#363636]"
                                  : "text-[#B8B8B8] line-through"
                              }`}
                            >
                              {item.meetingTime} {item.childName} 학부모
                            </div>
                          ))}
                          {scheduleItems.length !== 0 && <hr />}
                        </div>
                      )}
                      {scheduleItems.length !== 0 && (
                        <div>
                          <div className="font-bold text-[18px] m-1">
                            개인일정
                          </div>
                          {scheduleItems.map(
                            ({ id, content, confirmationStatus }, index) => (
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
                            )
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between items-center mt-3">
                <input
                  className="border w-[120px] h-[40px] border-[2px] border-[#B8B8B8] mr-1 rounded-[10px] p-1"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <input
                  className="border flex-grow h-[40px] w-[100px] lg:w-full bg-[#F8F8F8] border-[2px] rounded-[10px] border-[#B8B8B8] mr-1 p-1"
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
    </TeacherLayout>
  );
}
