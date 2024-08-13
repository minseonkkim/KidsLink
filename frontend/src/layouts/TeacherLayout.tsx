import { useState, useEffect } from "react";
import { Sidebar } from "../components/teacher/common/Sidebar";
import { Header } from "../components/teacher/common/Header";
import {
  deleteAlarm,
  deleteAllAlarms,
  getAlarmCount,
  getAllAlarms,
} from "../api/alarm";
import { useTeacherInfoStore } from "../stores/useTeacherInfoStore";

interface Alarm {
  id: number;
  contents: string;
  date: string;
  code: string;
}

export default function TeacherLayout({
  children,
  activeMenu,
  setActiveMenu,
  titleComponent,
  imageSrc,
}: any) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return window.innerWidth >= 1024;
  });

  const [alertList, setAlertList] = useState<Alarm[]>([]);
  const [alertNum, setAlertNum] = useState(0);

  const checkIsLoggedIn = () => !!localStorage.getItem("accessToken"); // 로그인 상태 확인 함수

  const fetchAlarmList = async () => {
    if (!checkIsLoggedIn()) return; // 로그아웃 상태이면 함수 실행 중지
    console.log("전체 알람 가져오려고 시도 중");
    try {
      const fetchedAlarmList = await getAllAlarms();
      const sortedAlarmList = fetchedAlarmList.sort((a, b) => b.id - a.id);
      setAlertList(sortedAlarmList);
    } catch (error) {
      console.error("Failed to fetch alarms:", error);
    }
  };

  const fetchAlarmCount = async () => {
    if (!checkIsLoggedIn()) return; // 로그아웃 상태이면 함수 실행 중지
    console.log("알람 개수 가져오려고 시도 중");
    try {
      const count = await getAlarmCount();
      setAlertNum(count);
    } catch (error) {
      console.error("Failed to fetch alarm count:", error);
    }
  };

  useEffect(() => {
    if (checkIsLoggedIn()) { // 로그인이 되어 있을 때만 실행
      fetchAlarmList();
      fetchAlarmCount();
    }
  }, []);

  const deleteItem = async (id: number) => {
    if (!checkIsLoggedIn()) return; // 로그아웃 상태이면 함수 실행 중지
    try {
      await deleteAlarm(id);
      // 삭제 후 알람 목록과 개수를 업데이트
      await fetchAlarmList();
      await fetchAlarmCount();
    } catch (error) {
      console.error("Failed to delete alarm:", error);
    }
  };

  const deleteAllItems = async () => {
    if (!checkIsLoggedIn()) return; // 로그아웃 상태이면 함수 실행 중지
    try {
      await deleteAllAlarms();
      // 삭제 후 알람 목록과 개수를 업데이트
      await fetchAlarmList();
      await fetchAlarmCount();
    } catch (error) {
      console.error("Failed to delete all alarms:", error);
    }
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const teacherInfo = useTeacherInfoStore((state) => state.teacherInfo);

return (
  <>
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        handleLinkClick={handleLinkClick}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        alertNum={alertNum} 
        alertList={alertList}
        fetchAlarmList={fetchAlarmList} 
        fetchAlarmCount={fetchAlarmCount} 
        deleteItem={deleteItem} 
        deleteAllItems={deleteAllItems}
      />
      <main
        className={`flex-1 p-8 min-h-screen max-h-screen bg-[#F5F5F5] overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-60" : "lg:ml-0"
        }`}
      >
        {!isSidebarOpen && <div className="h-[80px] lg:h-0"></div>}
        <Header
          alertNum={alertNum}
          alertList={alertList}
          fetchAlarmList={fetchAlarmList}
          fetchAlarmCount={fetchAlarmCount}
          deleteItem={deleteItem}
          deleteAllItems={deleteAllItems}
          titleComponent={titleComponent}
          imageSrc={imageSrc}
          activeMenu={activeMenu}
          userName={teacherInfo?.name}
        />
        <div className="bg-white shadow-lg rounded-lg p-6 h-full overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  </>
);

}
