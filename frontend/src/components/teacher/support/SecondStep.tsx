import { useState } from "react";
import moment from "moment"; // 날짜 포맷을 위해 moment.js 사용

interface Meeting {
    date: string;
    time: string;
    teacherId: number;
    teacherName: string;
    parentId: number;
    childName: string;
}

interface GroupedMeetings {
    [parentId: number]: {
        childName: string;
        times: { date: string; time: string }[];
    };
}

export default function TeacherMeetingConfirm() {
    const today = moment().format("YYYY-MM-DD"); // 오늘 날짜를 "YYYY-MM-DD" 형식으로 설정
    const groupedMeetings: GroupedMeetings = {
        1: {
            childName: "훈이",
            times: [
                { date: today, time: "18:00" },
                { date: today, time: "18:30" },
                { date: today, time: "19:00" },
            ],
        },
        2: {
            childName: "유리",
            times: [
                { date: today, time: "18:00" },
                { date: today, time: "18:30" },
                { date: today, time: "19:00" },
            ],
        },
    };

    const [selectedTimes, setSelectedTimes] = useState<{ [parentId: number]: string }>({});

    const handleTimeSlotClick = (parentId: number, timeSlot: string) => {
        setSelectedTimes(prevSelectedTimes => {
            if (prevSelectedTimes[parentId] === timeSlot) {
                const { [parentId]: removed, ...rest } = prevSelectedTimes; 
                return rest;
            }

            return {
                ...prevSelectedTimes,
                [parentId]: timeSlot
            };
        });
    };

    return (
        <div className="w-full py-3 pt-72">
        <div className="dark-overlay"></div>
          <div className="w-full mt-10 mb-32">
          {Object.keys(groupedMeetings).length !== 0 && (
                <div className="text-center text-[17px] mb-3">
                    학부모님들께서 선택하신 희망 날짜 및 시간입니다.<br />일정 조율하기 버튼을 누르면 선택하지 않은 일정을 자동으로 조율합니다.
                    <br />예약을 확정하시려면 확정하기 버튼을 눌러주세요.
                </div>
            )}

            {Object.keys(groupedMeetings).length !== 0 && (
                <div className="flex justify-center mb-4">
                    <button 
                        className="mr-2 h-[40px] border-2 border-[#7C7C7C] bg-[#E3EEFF] px-4 py-2 font-bold rounded-md hover:bg-[#D4DDEA]"
                    >
                        일정조율하기
                    </button>
                    <button 
                        className="h-[40px] border-2 border-[#7C7C7C] bg-[#E3EEFF] px-4 py-2 font-bold rounded-md hover:bg-[#D4DDEA]"
                    >
                        확정하기
                    </button>
                </div>
            )}
            {Object.keys(groupedMeetings).length !== 0 ? (
                <div className="mt-8 mx-4 lg:mx-8 flex flex-col lg:flex-row lg:flex-wrap gap-4">
                    {Object.entries(groupedMeetings).map(([parentId, { childName, times }]) => (
                        <div key={parentId} className="bg-gray-100 p-6 rounded-lg shadow-md w-full lg:w-[1200px]">
                            <h3 className="text-xl font-bold mb-4 text-[23px]">{`${childName} 학부모님`}</h3>
                            <ul className="list-none p-0">
                                {times.map((timeSlot, index) => {
                                    const slot = `${timeSlot.date} ${timeSlot.time}`;
                                    const isSelected = selectedTimes[parentId]?.includes(slot);
                                    return (
                                        <li 
                                            key={index}
                                            className={`p-4 mb-2 border border-gray-300 rounded-md ${isSelected ? 'bg-blue-100' : 'bg-white'}`}
                                            onClick={() => handleTimeSlotClick(Number(parentId), slot)}
                                        >
                                            {slot}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-[400px] text-center text-[18px]">
                    학부모님들께서 선택하신 희망 날짜 및 시간이 없어요.
                </div>
            )}
          </div>
        </div>
    );
}
