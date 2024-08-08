import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { confirmMeeting, getParentSelectedTime } from "../../api/meeting";
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
    const [groupedMeetings, setGroupedMeetings] = useState<GroupedMeetings>({});
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
        return data.reduce((acc, current) => {
            const { parentId, childName, date, time } = current;
            if (!acc[parentId]) {
                acc[parentId] = { childName, times: [] };
            }
            acc[parentId].times.push({ date, time });
            acc[parentId].times.reverse();  // Reverse the times array
            return acc;
        }, {} as GroupedMeetings);
    };

    useEffect(() => {
        fetchSelectedMeeting();
    }, []);

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

    return (
        <>
            <TeacherHeader />
            <div className="mt-32 px-32">
                <NavigateBack backPage="화상상담" backLink='/meeting' />
                <Title title="상담시간 확정" />
                {Object.keys(groupedMeetings).length !== 0 && 
                <button 
                    className="absolute top-[125px] right-[150px] mt-2 h-[40px] border-2 border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA]"
                    onClick={handleConfirmMeetingClick}
                >
                    확정하기
                </button> }
                {Object.keys(groupedMeetings).length !== 0 && 
                 <div className="text-center text-[17px]">학부모님들께서 선택하신 희망 날짜 및 시간입니다.<br />예약을 확정하시려면 확정하기 버튼을 눌러주세요.</div>
                }
                {Object.keys(groupedMeetings).length !== 0 ?
                <div className="mt-8 mx-8 flex justify-center">
                    {Object.entries(groupedMeetings).map(([parentId, { childName, times }]) => (
                        <div key={parentId} className="bg-gray-100 p-6 mb-6 rounded-lg shadow-md w-[1200px]">
                            <h3 className="text-xl font-bold mb-4 text-[23px]">{`${childName} 학부모님`}</h3>
                            <ul className="list-none p-0">
                                {times.map((timeSlot, index) => (
                                    <li key={index} className="bg-white p-4 mb-2 border border-gray-300 rounded-md">
                                        {`${timeSlot.date} ${timeSlot.time}`}
                                    </li>
                                ))}
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
