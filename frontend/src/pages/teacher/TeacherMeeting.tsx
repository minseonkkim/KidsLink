import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import ScheduledConsulting from "../../components/teacher/consulting/ScheduledConsulting";
import ProfileImg from '../../assets/teacher/profile_img.jpg';
import { Link } from "react-router-dom"
import { IoMdCalendar } from "react-icons/io";

export default function TeacherMeeting() {
  const teacherId = 123; // 실제 teacherId를 가져와야 합니다.

  return (
    <>
      <TeacherHeader />
      <div className="mt-[120px] px-[130px]">
        <NavigateBack backPage="홈" backLink='/' />
        <Title title="화상상담" />
        <Link to="/meeting/reservation">
          <button className="flex flex-row items-center absolute top-[125px] right-[150px] border-[2px] border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA]">
            <IoMdCalendar className="mr-1 text-[22px]" />
            상담가능시간 open
          </button>
        </Link>
        <div className="flex flex-row flex-wrap justify-between items-start">
          <Link to={`/meeting/${teacherId}`}>
            <ScheduledConsulting 
              time="2024.07.18 17:00" 
              name="김민선" 
              profileImgPath={ProfileImg} 
              isActivate={true}
            />
          </Link>
          <Link to={`/meeting/${teacherId}`}>
            <ScheduledConsulting 
              time="2024.07.18 14:00" 
              name="김범수" 
              profileImgPath={ProfileImg} 
              isActivate={false}
            />
          </Link>
          <Link to={`/meeting/${teacherId}`}>
            <ScheduledConsulting 
              time="2024.07.18 16:00" 
              name="이상민" 
              profileImgPath={ProfileImg} 
              isActivate={false}
            />
          </Link>
        </div>
      </div>
    </>
  );
}
