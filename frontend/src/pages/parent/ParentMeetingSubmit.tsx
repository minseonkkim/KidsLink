import { getTeacherReservation, Reservation } from "../../api/meeting";
import CommonHeader from "../../components/parent/common/CommonHeader"
import { useEffect, useState } from "react";

const ParentMeetingSubmit = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const fetchedReservations = await getTeacherReservation();
        setReservations(fetchedReservations);
      } catch (error) {
        console.error("Failed to fetch teacher-reservation:", error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      <CommonHeader title="상담 예약" />
      <div>
      
      </div>
    </div>
  )
}

export default ParentMeetingSubmit