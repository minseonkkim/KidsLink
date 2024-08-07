import { useEffect, useState } from 'react';
import MenuButton from "../../components/teacher/main/MenuButton";
import growthdiaryBtnImg from "../../assets/teacher/growthdiary_btn_img.png";
import noticeBtnImg from "../../assets/teacher/notice_btn_img.png";
import albumBtnImg from "../../assets/teacher/album_btn_img.png";
import documentBtnImg from "../../assets/teacher/document_btn_img.png";
import busBtnImg from "../../assets/teacher/bus_btn_img.png";
import consultingBtnImg from "../../assets/teacher/consulting_btn_img.png";
import TeacherHeader from '../../components/teacher/common/TeacherHeader';
import { Link } from "react-router-dom";
import { useTeacherInfoStore } from '../../stores/useTeacherInfoStore';
import DefaultProfile from '../../assets/teacher/default_profile.png';
import { getTeacherInfo } from '../../api/Info';
import moment from 'moment';
import { getTeacherSchedules } from '../../api/schedule';
import { ScheduleItemType } from '../../components/teacher/schedule/ScheduleItem';

export default function TeacherHome() {
    const { teacherInfo, setTeacherInfo } = useTeacherInfoStore();
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date());
    const [scheduleItems, setScheduleItems] = useState<ScheduleItemType[]>([]);

    const formatDate = (date) => {
        if (date instanceof Date) {
            return moment(date).format("YYYY-MM-DD");
        }
        return '';
    };

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
            console.log('dd', scheduleItems)
        } catch (error) {
            console.error("Failed to fetch schedules:", error);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    

    useEffect(() => {
        const fetchTeacherInfo = async () => {
            try {
                const info = await getTeacherInfo();
                setTeacherInfo(info);
            } catch (error) {
                console.error('Failed to fetch teacher info', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherInfo();
    }, [setTeacherInfo]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!teacherInfo) {
        return <div>Error: Unable to fetch teacher information.</div>;
    }

    // 오늘 날짜 객체 생성
    const today = new Date();

    // 연도 가져오기
    const year = today.getFullYear();

    // 월 가져오기 (0부터 시작하므로 +1 필요)
    const month = String(today.getMonth() + 1).padStart(2, '0');

    // 일 가져오기
    const day = String(today.getDate()).padStart(2, '0');

    return (
        <>
            <TeacherHeader />
            <div className="mt-[85px] flex flex-col lg:flex-row min-h-[calc(100vh-105px)] h-full items-center justify-start lg:justify-between lg:pl-[150px] lg:pr-[35px] px-4">
                <div className="w-[290px] lg:w-[340px] h-auto lg:h-[500px] h-[200px] rounded-[20px] bg-[#f4f4f4] flex flex-col lg:flex-col items-center py-7 drop-shadow-md mb-5 lg:mb-0 mt-7 lg:mt-0">
                    <div className="flex flex-row lg:flex-col items-center lg:items-center">
                        <div className="w-[90px] h-[90px] lg:w-[170px] lg:h-[170px]">
                            <img src={
                                teacherInfo.profile == null ? 
                                DefaultProfile 
                                : teacherInfo.profile
                            } className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div className="flex flex-col lg:items-center items-start mt-0 lg:mt-3 text-left lg:text-center ml-4 lg:ml-0 lg:mb-2">
                            <p className="text-[19px] lg:text-[30px] font-bold text-[#8cad1e]">{teacherInfo.kindergartenClassName + " 선생님"}</p>
                            <p className="text-[17px] lg:text-[22px] font-bold text-[#363636]">{teacherInfo.name}</p>
                        </div>
                    </div>
                    <div className="w-[290px] h-auto lg:h-full rounded-[10px] bg-[#f4f4f4] lg:bg-white flex flex-col items-center justify-between mt-4 lg:mt-0">
                        <div className="w-[290px] h-[35px] rounded-tl-[10px] rounded-tr-[10px] bg-[#CBCBCB] flex items-center justify-center font-bold text-[#ffffff] text-[18px] hidden lg:flex">{year} / {month} / {day}</div>
                        <div className="w-[250px] mx-3 mt-2 text-center text-[16px] whitespace-nowrap truncate hidden lg:block">
                            <Link to='/schedule'>
                                <div>
                                    {scheduleItems.length === 0 ? <div>오늘의 일정이 없어요.</div> : 
                                    scheduleItems
                                    .filter(item => item.confirmationStatus === "F")
                                    .slice(0, 2)
                                    .map((item, index) => (
                                        <div key={index}>{item.content}</div>
                                    ))
                                    }
                                    <div>...</div>
                                </div>
                            </Link>
                        </div>
                        <div className="w-full flex flex-col lg:flex-row justify-center items-center lg:justify-around lg:items-stretch">
                            <Link to="/schedule">
                                <button className="hover:bg-[#CBCBCB] hover:text-[#fff] bg-[#c3c3c3] lg:bg-[#f1f1f1] lg:text-[#7C7C7C] w-[210px] lg:w-[128px] h-[38px] rounded-[10px] text-center text-[#fff] font-bold text-[17px] mx-1 lg:my-3 my-2">모든 일정 보기</button>
                            </Link>
                            <Link to="/ourclass">
                                <button className="hover:bg-[#CBCBCB] hover:text-[#fff] bg-[#c3c3c3] lg:bg-[#f1f1f1] lg:text-[#7C7C7C] w-[210px] lg:w-[128px] h-[38px] rounded-[10px] text-center text-[#fff] font-bold text-[17px] mx-1 lg:my-3 my-2">우리반 보기</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row flex-wrap w-full lg:w-[840px] justify-center lg:justify-start">
                    <Link to="/growth"><MenuButton name="성장일지" imgpath={growthdiaryBtnImg} /></Link>
                    <Link to="/notice"><MenuButton name="알림장" imgpath={noticeBtnImg} /></Link>
                    <Link to="/album"><MenuButton name="사진분류" imgpath={albumBtnImg} /></Link>
                    <Link to="/document"><MenuButton name="문서관리" imgpath={documentBtnImg} /></Link>
                    <Link to="/meeting"><MenuButton name="화상상담" imgpath={consultingBtnImg} /></Link>
                    <Link to="/bus"><MenuButton name="등하원관리" imgpath={busBtnImg} /></Link>
                </div>
            </div>
        </>
    );
}
