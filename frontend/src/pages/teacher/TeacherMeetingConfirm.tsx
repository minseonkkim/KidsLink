import { useEffect, useState } from "react";
import { useTeacherInfoStore } from "../../stores/useTeacherInfoStore";
import { useNavigate } from "react-router-dom";
import Title from "../../components/teacher/common/Title";
import {
  confirmMeeting,
  getParentSelectedTime,
  optimalMeeting,
} from "../../api/meeting";
import {
  showToastError,
  showToastSuccess,
} from "../../components/teacher/common/ToastNotification";
import ToastNotification from "../../components/teacher/common/ToastNotification";
import TeacherLayout from "../../layouts/TeacherLayout";
import daramgi from "../../assets/teacher/meeting-daramgi.png";
import daramgisad from "../../assets/common/crying-daramgi.png";
import { getTeacherInfo } from "../../api/Info";
import useModal from "../../hooks/teacher/useModal"; 

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
  const [selectedTimes, setSelectedTimes] = useState<{
    [parentId: number]: string;
  }>({});
  const navigate = useNavigate();
  const { openModal, closeModal, Modal } = useModal();  // useModal 훅 사용

  const teacherUsername = useTeacherInfoStore.getState().teacherInfo?.username || "Unknown Teacher";

  useEffect(() => {
    const getAndSetTeacherInfo = async () => {
      const teacherInfo = useTeacherInfoStore.getState().teacherInfo;

      if (!teacherInfo) {
        try {
          const data = await getTeacherInfo();
          useTeacherInfoStore.setState({ teacherInfo: data });
        } catch (error) {
          console.error("Failed to fetch teacher info:", error);
        }
      }
    };

    getAndSetTeacherInfo();
  }, []);

  useEffect(() => {
    fetchSelectedMeeting();
  }, []);

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
  
      // 중복 체크: 동일한 date와 time이 이미 존재하는지 확인
      const isDuplicate = acc[parentId].times.some(
        (existingTime) => existingTime.date === date && existingTime.time === time
      );
  
      if (!isDuplicate) {
        acc[parentId].times.push({ date, time });
      }
  
      return acc;
    }, {} as GroupedMeetings);
  
    for (const parentId in grouped) {
      grouped[parentId].times.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
    }
  
    return grouped;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const formattedHours = hours.padStart(2, "0");
    return `${formattedHours}:${minutes}`;
  };

  const handleTimeSlotClick = (parentId: number, timeSlot: string) => {
    setSelectedTimes((prevSelectedTimes) => {
      const updatedSelectedTimes = { ...prevSelectedTimes };

      if (updatedSelectedTimes[parentId] === timeSlot) {
        delete updatedSelectedTimes[parentId];
      } else {
        Object.keys(updatedSelectedTimes).forEach((id) => {
          if (updatedSelectedTimes[Number(id)] === timeSlot) {
            delete updatedSelectedTimes[Number(id)];
          }
        });

        updatedSelectedTimes[parentId] = timeSlot;
      }

      return updatedSelectedTimes;
    });
  };

  const createTransformedData = (
    groupedMeetings: GroupedMeetings,
    selectedTimes: { [parentId: number]: string },
    teacherUsername: string
  ) => {
    return Object.entries(groupedMeetings).flatMap(
      ([parentId, { childName, times }]) => {
        const selectedTime = selectedTimes[parentId];
        if (selectedTime) {
          const [date, time] = selectedTime.split(" ");
          return [
            {
              parentId: Number(parentId),
              childName: childName,
              date: date,
              time: time,
              teacherName: teacherUsername,
            },
          ];
        } else {
          return times.map((timeSlot) => ({
            parentId: Number(parentId),
            childName: childName,
            date: timeSlot.date,
            time: timeSlot.time,
            teacherName: teacherUsername,
          }));
        }
      }
    );
  };

  const handleConfirmMeetingClick = async () => {
    const allParentsSelected = Object.keys(groupedMeetings).every(
      (parentId) => selectedTimes[parentId]
    );

    // 선택된 시간이 전혀 없는 경우
    if (Object.keys(selectedTimes).length === 0) {
      showToastError(<div>상담 일정을 선택해주세요.</div>);
      return;
    }

    if (!allParentsSelected) {
      openModal(
        <div className="w-full max-w-md py-3 px-3 bg-white">
        <p className="text-gray-700 mb-6">
          모든 학부모의 상담 시간이 선택되지 않았습니다. <br />
          상담시간을 확정하시겠습니까?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={async () => {
              closeModal();
              await submitConfirmMeeting();
            }}
            className="px-4 py-2 border-[2px] border-[#7C7C7C] bg-[#E3EEFF] font-bold rounded-[10px] shadow-md hover:bg-[#D4DDEA] transition duration-300 ease-in-out"
          >
            확정
          </button>

          <button
            onClick={closeModal}
            className="px-4 py-2 bg-neutral-200 border-[2px] border-[#7C7C7C] text-black font-semibold rounded-lg shadow-md hover:bg-neutral-300 transition duration-300 ease-in-out"
          >
            취소
          </button>
        </div>
      </div>
      );
      return;
    }

    await submitConfirmMeeting();
  };

  const submitConfirmMeeting = async () => {
    try {
      // 선택된 시간대만을 포함하는 데이터를 생성
      const transformedData = Object.entries(selectedTimes).map(
        ([parentId, selectedTime]) => {
          const [date, time] = selectedTime.split(" ");
          const childName = groupedMeetings[Number(parentId)].childName;
          return {
            parentId: Number(parentId),
            childName: childName,
            date: date,
            time: time,
            teacherName: teacherUsername,
          };
        }
      );
  
      if (transformedData.length > 0) {
        const response = await confirmMeeting(transformedData);
        if (response.status === "success") {
          showToastSuccess(
            <div>
              상담일자가 확정되었습니다!
              <br />
              상담목록으로 이동합니다.
            </div>
          );
  
          setTimeout(() => {
            navigate("/meeting/scheduled");
          }, 3000);
        } else {
          showToastError(
            <div>동일한 상담일정이 존재합니다. 일정을 조율해주세요.</div>
          );
        }
      } else {
        showToastError(<div>선택된 상담일자가 없습니다.</div>);
      }
    } catch (error) {
      showToastError(<div>상담일자 확정 중 오류가 발생했습니다.</div>);
      console.error("상담일자 확정 중 오류 발생:", error);
    }
  };

  const handleClassifyMeetingClick = async () => {
    try {
      const selectedTimeSlots = Object.values(selectedTimes);

      const transformedData = Object.entries(groupedMeetings)
        .filter(([parentId]) => !selectedTimes[Number(parentId)])
        .flatMap(([parentId, { childName, times }]) => {
          const availableTimes = times.filter(
            (timeSlot) => !selectedTimeSlots.includes(`${timeSlot.date} ${timeSlot.time}`)
          );

          return availableTimes.map((timeSlot) => ({
            parentId: Number(parentId),
            childName: childName,
            date: timeSlot.date,
            time: timeSlot.time,
            teacherName: teacherUsername,
          }));
        });

      const response = await optimalMeeting(transformedData);
      if (response.status === "success") {
        showToastSuccess(<div>상담일자가 분류되었습니다!</div>);

        const newSelectedTimes: { [parentId: number]: string } = { ...selectedTimes };
        response.data.forEach((meeting: Meeting) => {
          const formattedTime = formatMeetingTime(meeting.time);
          const slot = `${meeting.date} ${formattedTime}`;
          newSelectedTimes[meeting.parentId] = slot;
        });

        setSelectedTimes(newSelectedTimes);
      } else {
        showToastError(<div>모든 일정을 분류할 수 없습니다.</div>);
      }
    } catch (error) {
      showToastError(<div>상담일자 분류 중 오류가 발생했습니다.</div>);
      console.error("상담일자 분류 중 오류 발생:", error);
    }
  };

  const formatMeetingTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const formattedHours = parseInt(hours, 10);
    return `${formattedHours}:${minutes}`;
  };

  const tabs = [
    { label: "상담가능시간 open", link: "/meeting/reservation" },
    { label: "상담시간 확정", link: "/meeting/confirm" },
    { label: "예약된 화상상담", link: "/meeting/scheduled" },
    { label: "녹화된 상담", link: "/meeting/recordings" },
  ];

  return (
    <TeacherLayout
      activeMenu="meeting"
      setActiveMenu={() => {}}
      titleComponent={
        <Title
          title="상담시간 확정"
          tooltipContent={
            <div className="w-[280px] leading-relaxed">
              키즈링크만의 알고리즘으로 최대한 많은 학부모와 상담을 할 수 있도록
              상담 시간을 확정해드려요.
            </div>
          }
          tabs={tabs}
        />
      }
      imageSrc={daramgi}
    >
      <div className="w-full mb-32 px-4 lg:px-8 py-6 lg:py-8">
        {Object.keys(groupedMeetings).length !== 0 && (
          <div className="text-center text-[17px] mb-3">
            학부모님들께서 선택하신 희망 날짜 및 시간입니다.
            <br />
            일정 조율하기 버튼을 누르면 선택하지 않은 일정을 자동으로
            조율합니다.
            <br />
            예약을 확정하시려면 확정하기 버튼을 눌러주세요.
          </div>
        )}

        {Object.keys(groupedMeetings).length !== 0 && (
          <div className="flex justify-center mb-4">
            <button
              className="mr-2 h-[40px] border-2 border-[#7C7C7C] bg-[#E3EEFF] px-4 py-2 font-bold rounded-md hover:bg-[#D4DDEA]"
              onClick={handleClassifyMeetingClick}
            >
              일정조율하기
            </button>
            <button
              className="h-[40px] border-2 border-[#7C7C7C] bg-[#E3EEFF] px-4 py-2 font-bold rounded-md hover:bg-[#D4DDEA]"
              onClick={handleConfirmMeetingClick}
            >
              확정하기
            </button>
          </div>
        )}

        {Object.keys(groupedMeetings).length !== 0 ? (
          <div className="mt-8 mx-4 lg:mx-8 flex flex-col lg:flex-row lg:flex-wrap gap-4">
            {Object.entries(groupedMeetings).map(
              ([parentId, { childName, times }]) => (
                <div
                  key={parentId}
                  className="bg-gray-100 p-6 rounded-lg shadow-md w-full lg:w-[1200px]"
                >
                  <h3 className="text-xl font-bold mb-4 text-[23px]">{`${childName} 학부모님`}</h3>
                  <ul className="list-none p-0">
                    {times.map((timeSlot, index) => {
                      const slot = `${timeSlot.date} ${timeSlot.time}`;
                      const isSelected =
                        selectedTimes[parentId]?.includes(slot);
                      return (
                        <li
                          key={index}
                          className={`p-4 mb-2 border border-gray-300 rounded-md ${
                            isSelected ? "bg-blue-100" : "bg-white"
                          } ${isSelected ? "cursor-default" : "cursor-pointer"}`}
                          onClick={() =>
                            handleTimeSlotClick(Number(parentId), slot)
                          }
                        >
                          {slot}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="flex bg-transparent">
            <div className="m-auto text-center mt-24">
              <img
                src={daramgisad}
                alt="daramgisad"
                className="h-[200px] mb-6 mx-auto"
              />
              <p className="text-[22px] font-bold text-[#333] mb-4">
                희망 상담일자가 존재하지 않습니다.
              </p>
            </div>
          </div>
        )}
      </div>
      <ToastNotification />
      <Modal /> {/* 모달 컴포넌트 */}
    </TeacherLayout>
  );
}
