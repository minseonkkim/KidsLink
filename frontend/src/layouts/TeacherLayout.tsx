import { useState, useEffect } from "react";
import { Sidebar } from "../components/teacher/common/Sidebar";
import { Header } from "../components/teacher/common/Header";
import {
  deleteAlarm,
  deleteAllAlarms,
  getAlarmCount,
  getAllAlarms,
} from "../api/alarm";

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

  const fetchAlarmList = async () => {
    try {
      const fetchedAlarmList = await getAllAlarms();
      const sortedAlarmList = fetchedAlarmList.sort((a, b) => b.id - a.id);
      setAlertList(sortedAlarmList);
    } catch (error) {
      console.error("Failed to fetch alarms:", error);
    }
  };
  
  const fetchAlarmCount = async () => {
    try {
      const count = await getAlarmCount();
      setAlertNum(count);
    } catch (error) {
      console.error("Failed to fetch alarm count:", error);
    }
  };

  useEffect(() => {
    fetchAlarmList();
    fetchAlarmCount();
  }, []);

  const deleteItem = async (id: number) => {
    await deleteAlarm(id);
    await fetchAlarmList();
    await fetchAlarmCount();
  };

  const deleteAllItems = async () => {
    await deleteAllAlarms();
    await fetchAlarmList();
    await fetchAlarmCount();
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

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
          />
          <div className="bg-white shadow-lg rounded-lg p-6 h-full overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
