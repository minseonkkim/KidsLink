import { useEffect, useState } from "react";
import { getAllPossibleReservations, postAllPossibleReservations } from "../../api/meeting";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/parent/common/Modal";
import { ParentReservation, Reservation } from "../../types/meeting";

const ParentMeetingSubmit = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedMeetings, setSelectedMeetings] = useState<Set<number>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showMaxSelectionWarning, setShowMaxSelectionWarning] = useState<boolean>(false);
  const [showNoSelectionWarning, setShowNoSelectionWarning] = useState<boolean>(false); // 새로운 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const fetchedReservations = await getAllPossibleReservations();
        const filteredReservations = filterReservations(fetchedReservations);
        setReservations(filteredReservations);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      }
    };
    fetchReservations();
  }, []);

  const filterReservations = (reservations: Reservation[]) => {
    const now = new Date();
    return reservations.filter((reservation) => {
      const reservationDate = new Date(reservation.date);

      // 오늘 이전 날짜는 필터링
      if (reservationDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
        return false;
      }

      // 오늘 날짜에 대해 시간 필터링
      if (
        reservationDate.getFullYear() === now.getFullYear() &&
        reservationDate.getMonth() === now.getMonth() &&
        reservationDate.getDate() === now.getDate()
      ) {
        const [hour, minute] = reservation.time.split(":").map(Number);
        if (hour < now.getHours() || (hour === now.getHours() && minute <= now.getMinutes())) {
          return false; // 이미 지난 시간대는 표시하지 않음
        }
      }

      return true;
    });
  };

  const handleTimeSlotClick = (meetingId: number) => {
    setSelectedMeetings((prevSelectedMeetings) => {
      const newSelectedMeetings = new Set(prevSelectedMeetings);
      if (newSelectedMeetings.has(meetingId)) {
        newSelectedMeetings.delete(meetingId);
      } else {
        if (newSelectedMeetings.size < 3) {
          newSelectedMeetings.add(meetingId);
        } else {
          setShowMaxSelectionWarning(true); // 모달 창을 띄움
        }
      }
      return newSelectedMeetings;
    });
  };

  const handleSubmit = async () => {
    if (selectedMeetings.size === 0) {
      setShowNoSelectionWarning(true); // 선택한 시간이 없을 때 경고 메시지 표시
      return;
    }

    const selectedReservations: ParentReservation[] = Array.from(selectedMeetings).map((meetingId) => {
      const reservation = reservations.find((res) => res.meetingId === meetingId);
      return {
        meetingDate: reservation?.date ?? '',
        meetingTime: reservation?.time ?? '',
      };
    });

    try {
      await postAllPossibleReservations(selectedReservations);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to submit reservations:", error);
    }
  };

  const handleModalClose = () => {
    setIsSubmitted(false);
    navigate('/meeting');
  };

  const handleMaxSelectionModalClose = () => {
    setShowMaxSelectionWarning(false);
  };

  const handleNoSelectionModalClose = () => { // 새로운 모달 닫기 함수 추가
    setShowNoSelectionWarning(false);
  };

  const groupedReservations = reservations.reduce((acc, reservation) => {
    if (!acc[reservation.date]) {
      acc[reservation.date] = [];
    }
    acc[reservation.date].push(reservation);
    return acc;
  }, {} as { [date: string]: Reservation[] });

  const formatDateString = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${year}년 ${Number(month)}월 ${Number(day)}일`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl px-10 p-6">
        <p className="text-sm font-light mt-4 mb-10 text-center">
          상담 시간은 최대 3개까지 선택하실 수 있습니다.
        </p>
        <div className="space-y-8">
          {Object.keys(groupedReservations).map((date) => (
            <div key={date}>
              <p className="text-lg font-semibold mb-4 text-left">{formatDateString(date)}</p>
              <div className="grid grid-cols-3 gap-4">
                {groupedReservations[date].map((reservation) => (
                  <div
                    key={reservation.meetingId}
                    onClick={() => handleTimeSlotClick(reservation.meetingId)}
                    className={`cursor-pointer p-2 border rounded-lg text-center flex items-center justify-center w-24 mx-auto ${
                      selectedMeetings.has(reservation.meetingId)
                        ? "bg-yellow-300 border-yellow-500 text-gray-800"
                        : "bg-transparent border-gray-300 text-gray-800 hover:bg-gray-100"
                    } transition-colors duration-200 ease-in-out`}
                  >
                    <p className="text-lg">{reservation.time}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <button
            className="w-32 h-12 bg-[#ffec8a] rounded-full flex items-center justify-center text-base font-medium text-[#212121] hover:bg-[#fdda6e] transition-colors"
            onClick={handleSubmit}
          >
            제출
          </button>
        </div>
      </div>
      {isSubmitted && (
        <Modal
          message="제출이 완료되었습니다!"
          onClose={handleModalClose}
        />
      )}
      {showMaxSelectionWarning && (
        <Modal
          message="상담 시간은 최대 3개까지 선택하실 수 있습니다."
          onClose={handleMaxSelectionModalClose}
        />
      )}
      {showNoSelectionWarning && ( // 새로운 경고 모달 추가
        <Modal
          message="선택한 시간이 없습니다. 상담 시간을 선택해주세요."
          onClose={handleNoSelectionModalClose}
        />
      )}
    </div>
  );
};

export default ParentMeetingSubmit;
