import { useEffect, useState } from "react";
import { useTeacherInfoStore } from "../../stores/useTeacherInfoStore"
import { useNavigate } from "react-router-dom";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { confirmMeeting, getParentSelectedTime,classifyMeeting } from "../../api/meeting";
import { showToastError, showToastSuccess } from "../../components/teacher/common/ToastNotification";
import ToastNotification from "../../components/teacher/common/ToastNotification";

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
    const teacherName = useTeacherInfoStore(state => state.teacherInfo.username);
    const [groupedMeetings, setGroupedMeetings] = useState<GroupedMeetings>({});
    const [selectedTimes, setSelectedTimes] = useState<{ [parentId: number]: string }>({});
    const navigate = useNavigate();

    const fetchSelectedMeeting = async () => {
        try {
            const response = await getParentSelectedTime();
            let meetings: Meeting[] = [];
            if (Array.isArray(response)) {
                meetings = response;
            } else if (response && response.data) {
                meetings = response.data;
            } else {
                console.error("Invalid response structure", response);
                return;
            }
            const grouped = groupByParentId(meetings);
            setGroupedMeetings(grouped);
        } catch (error) {
            console.error("Failed to fetch parent selected times", error);
        }
    };

    const groupByParentId = (data: Meeting[]): GroupedMeetings => {
        const grouped = data.reduce((acc, current) => {
            const { parentId, childName, date, time } = current;
            if (!acc[parentId]) {
                acc[parentId] = { childName, times: [] };
            }
            acc[parentId].times.push({ date, time });
            return acc;
        }, {} as GroupedMeetings);

        // 날짜와 시간을 기준으로 정렬
        for (const parentId in grouped) {
            grouped[parentId].times.sort((a, b) => {
                const dateA = new Date(`${a.date} ${a.time}`);
                const dateB = new Date(`${b.date} ${b.time}`);
                return dateA.getTime() - dateB.getTime();
            });
        }

        return grouped;
    };

    useEffect(() => {
        fetchSelectedMeeting();
    }, []);

    const createTransformedData = (
        groupedMeetings: GroupedMeetings,
        selectedTimes: { [parentId: number]: string },
        teacherName: string
    ) => {
        return Object.entries(groupedMeetings).flatMap(([parentId, meeting]) => {
            const selectedTime = selectedTimes[Number(parentId)];
            if (selectedTime) {
                const [date, time] = selectedTime.split(' ');
                return [{
                    parentId: Number(parentId),
                    childName: meeting.childName,
                    date: date,
                    time: time,
                    teacherName: teacherName
                }];
            } else {
                return meeting.times.map(timeSlot => ({
                    parentId: Number(parentId),
                    childName: meeting.childName,
                    date: timeSlot.date,
                    time: timeSlot.time,
                    teacherName: teacherName
                }));
            }
        });
    };
    
    
    const handleConfirmMeetingClick = async () => {
        try {
            await confirmMeeting();
            showToastSuccess(
                <div>
                    상담일자가 확정되었습니다!<br />상담목록으로 이동합니다.
                </div>
            );

            setTimeout(() => {
                navigate('/meeting/scheduled');
            }, 3000);
        } catch (error) {
            showToastError(<div>상담일자 확정 중 오류가 발생했습니다.</div>);
            console.error('상담일자 확정 중 오류 발생:', error);
        }
    };
    const handleClassifyMeetingClick = async () => {
        
        try {
            const transformedData = createTransformedData(groupedMeetings, selectedTimes, teacherName);

            const response = await classifyMeeting(transformedData);
        if (response.status === "success") {
            showToastSuccess(
                <div>
                    상담일자가 분류되었습니다!
                </div>
            );
            const newSelectedTimes = {};
            response.data.forEach(meeting => {
                const slot = `${meeting.date} ${meeting.time}`;
                newSelectedTimes[meeting.parentId] = slot;
            });

            setSelectedTimes(newSelectedTimes);
        } else {
            showToastError(
                <div>
                    모든 일정을 분류할 수 없습니다.
                </div>
            );
        }

        } catch (error) {
            showToastError(<div>상담일자 분류 중 오류가 발생했습니다.</div>);
            console.error('상담일자 분류 중 오류 발생:', error);
        }
    };
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
        <>
            <TeacherHeader />
            <div className="mt-32 px-32">
                <NavigateBack backPage="화상상담" backLink='/meeting' />
                <Title title="상담시간 확정" tooltipContent={<div className="w-[280px] leading-relaxed">키즈링크만의 알고리즘으로 최대한 많은 학부모와 상담을 할 수 있도록 상담 시간을 확정해드려요.</div>}/>
                {Object.keys(groupedMeetings).length !== 0 && 
                <button 
                    className="absolute top-[125px] right-[150px] mt-2 h-[40px] border-2 border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA]"
                    onClick={handleConfirmMeetingClick}
                >
                    확정하기
                </button>
                 }
                 {Object.keys(groupedMeetings).length !== 0 && 
                <button 
                    className="absolute top-[125px] right-[240px] mt-2 h-[40px] border-2 border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA]"
                    onClick={handleClassifyMeetingClick}
                >
                    일정조율하기
                </button>
                 }
                {Object.keys(groupedMeetings).length !== 0 && 
                 <div className="text-center text-[17px]">학부모님들께서 선택하신 희망 날짜 및 시간입니다.<br />예약을 확정하시려면 확정하기 버튼을 눌러주세요.</div>
                }
                {Object.keys(groupedMeetings).length !== 0 ?
                <div className="mt-8 mx-8 flex justify-center">
                    {Object.entries(groupedMeetings).map(([parentId, { childName, times }]) => (
                        <div key={parentId} className="bg-gray-100 p-6 mb-6 rounded-lg shadow-md w-[1200px]">
                            <h3 className="text-xl font-bold mb-4 text-[23px]">{`${childName} 학부모님`}</h3>
                            <ul className="list-none p-0">
                            {times.map((timeSlot, index) => {
                                const slot = `${timeSlot.date} ${timeSlot.time}`;
                                const isSelected = selectedTimes[parentId]?.includes(slot);
                                return (
                                    <li 
                                        key={index}
                                        className={`bg-white p-4 mb-2 border border-gray-300 rounded-md ${isSelected ? 'bg-blue-100' : ''}`}
                                        onClick={() => handleTimeSlotClick(Number(parentId), slot)}
                                    >
                                        {slot}
                                    </li>
                                );
                            })}
                            </ul>
                        </div>
                    ))}
                </div>:
                <div className="flex items-center justify-center h-[400px]">
                    학부모님들께서 선택하신 희망 날짜 및 시간이 없어요.
                </div>}

            </div>
            <ToastNotification />
        </>
    );
}
