import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoSection from "../../components/parent/common/InfoSection";
import YearMonthSelector from "../../components/parent/common/YearMonthSelector";
import GrowthList from "../../components/parent/growth/GrowthList";
import daramgi from "../../assets/parent/growth-daramgi.png";
import { getKidAllGrowthDiarys } from "../../api/growthdiary";
import { Diary } from "../../types/growthdiary";
import { useParentInfoStore } from "../../stores/useParentInfoStore";
import { getParentInfo } from "../../api/Info";

export default function ParentGrowth() {
  const [diarys, setDiarys] = useState<Diary[]>([]);
  const [filteredDiarys, setFilteredDiarys] = useState<Diary[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
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
            const sortedDiarys = response.sort(
              (a, b) =>
                new Date(b.createDate).getTime() -
                new Date(a.createDate).getTime()
            );
            setDiarys(sortedDiarys);
          }
        }
      } catch (error) {
        console.error("Failed to fetch growth diarys", error);
      }
    }
    fetchParentInfoAndDiarys();
  }, [childId, setParentInfo]);

  useEffect(() => {
    const filtered = diarys.filter(
      (entry) =>
        new Date(entry.createDate).getFullYear() === selectedYear &&
        new Date(entry.createDate).getMonth() + 1 === selectedMonth
    );
    setFilteredDiarys(filtered);
  }, [diarys, selectedYear, selectedMonth]);

  const handleYearChange = (increment: number) => {
    setSelectedYear((prevYear) => prevYear + increment);
  };
  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
  };

  const handleBoxClick = (diaryId: number) => {
    navigate(`/growth/${diaryId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFEC8A]">
      <InfoSection
        description1="선생님이 전하는"
        main1="아이의 성장"
        main2=" 이야기"
        imageSrc={daramgi}
        altText="다람쥐"
      />

      <div className="flex flex-col flex-grow overflow-hidden rounded-tl-[20px] rounded-tr-[20px] bg-white shadow-top px-12 py-4 animate-slideUp">
        <YearMonthSelector
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          handleYearChange={handleYearChange}
          handleMonthChange={handleMonthChange}
        />

        <div className="flex-grow overflow-y-auto space-y-6 pb-6">
          <GrowthList
            filteredDiarys={filteredDiarys}
            handleBoxClick={handleBoxClick}
          />
        </div>
      </div>
    </div>
  );
}
