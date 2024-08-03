import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoSection from "../../components/parent/common/InfoSection";
import DiaryList from "../../components/parent/diary/DiaryList";
import daramgi from "../../assets/parent/growth-daramgi.png";
import { getKidAllGrowthDiarys } from "../../api/growthdiary";
import { useParentInfoStore } from "../../stores/useParentInfoStore";
import { getParentInfo } from "../../api/Info";
import "react-calendar/dist/Calendar.css";

export default function ParentDiary() {
  const [growthEntries, setGrowthEntries] = useState<any[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [scroll, setScroll] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const infoSectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const parentInfo = useParentInfoStore((state) => state.parentInfo);
  const setParentInfo = useParentInfoStore((state) => state.setParentInfo);
  const childId = parentInfo?.child.childId;

  useEffect(() => {
    async function fetchParentInfoAndDiarys() {
      try {
        let currentChildId = childId;
        if (!currentChildId) {
          const fetchedParentInfo = await getParentInfo();
          setParentInfo(fetchedParentInfo);
          currentChildId = fetchedParentInfo.child.childId;
        }

        if (currentChildId) {
          const response = await getKidAllGrowthDiarys(currentChildId);
          if (response) {
            setGrowthEntries(response);
          }
        }
      } catch (error) {
        console.error("Failed to fetch growth diarys", error);
      }
    }

    fetchParentInfoAndDiarys();
  }, [childId, setParentInfo]);

  useEffect(() => {
    const filtered = growthEntries.filter(
      (entry) =>
        new Date(entry.createDate).getFullYear() === selectedYear &&
        new Date(entry.createDate).getMonth() + 1 === selectedMonth
    );
    setFilteredEntries(filtered);
  }, [growthEntries, selectedYear, selectedMonth]);

  useEffect(() => {
    const handleScroll = () => {
      if (divRef.current) {
        const topPosition = divRef.current.getBoundingClientRect().top;
        if (topPosition <= 200) {
          setScroll(true);
        } else {
          setScroll(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBoxClick = (diaryId: number) => {
    navigate(`/diary/${diaryId}`);
  };

  const handleYearChange = (increment: number) => {
    setSelectedYear((prevYear) => prevYear + increment);
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
  };

  const months = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  return (
    <div className="min-h-[100vh] flex flex-col items-center bg-[#FFEC8A]">
      <div className="w-full flex flex-col items-center mt-16 flex-grow">
        <div ref={infoSectionRef}>
          <InfoSection
            description1="교사가 전하는"
            main1="아이의 성장"
            main2=" 이야기"
            imageSrc={daramgi}
            altText="다람쥐"
          />
        </div>
        <div
          ref={divRef}
          className="w-full bg-white rounded-tl-[20px] rounded-tr-[20px] px-12 py-6 shadow-top flex-grow overflow-hidden animate-slideUp"
          style={{ marginTop: "-40px" }}
        >
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => handleYearChange(-1)} className="text-lg">{"<"}</button>
            <span className="text-xl font-bold">{selectedYear}년</span>
            <button onClick={() => handleYearChange(1)} className="text-lg">{">"}</button>
          </div>
          <div className="overflow-x-auto flex items-center mb-8 space-x-2">
            {months.map((month, index) => (
              <button
                key={index}
                className={`px-2 py-1 whitespace-nowrap rounded ${selectedMonth === index + 1 ? 'bg-[#FFEC8A] text-white' : 'bg-transparent text-gray-800'} transition-colors duration-200`}
                onClick={() => handleMonthChange(index + 1)}
                style={{ fontSize: '16px' }}
              >
                {month}
              </button>
            ))}
          </div>
          <div
            className={`space-y-6 overflow-auto`}
            style={{
              maxHeight: "calc(100vh - 270px)",
              paddingBottom: "100px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <DiaryList
              entries={filteredEntries}
              handleBoxClick={handleBoxClick}
              scroll={scroll}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
