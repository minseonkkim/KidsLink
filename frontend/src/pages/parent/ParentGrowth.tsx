import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../../components/parent/common/CommonHeader";
import InfoSection from "../../components/parent/common/InfoSection";
import SearchDateBar from "../../components/parent/common/SearchDateBar";
import GrowthList from "../../components/parent/growth/GrowthList";
import daramgi from "../../assets/parent/growth-daramgi.png";
import { getKidAllGrowthDiarys } from '../../api/growthdiary';
import { useParentInfoStore } from '../../stores/useParentInfoStore';

export default function ParentGrowth() {
  const [growthEntries, setGrowthEntries] = useState<any[]>([]);
  const [searchDate, setSearchDate] = useState("");
  const [scroll, setScroll] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const childId = useParentInfoStore((state) => state.parentInfo?.child.childId);

  useEffect(() => {
    async function fetchGrowthDiarys() {
      if (childId) {
        try {
          const response = await getKidAllGrowthDiarys(childId);
          if (response) {
            setGrowthEntries(response);
          }
        } catch (error) {
          console.error("Failed to fetch growth diarys", error);
        }
      }
    }

    fetchGrowthDiarys();
  }, [childId]);

  const filteredEntries = growthEntries.filter((entry) =>
    entry.createDate.includes(searchDate)
  );

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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBoxClick = (id: number) => {
    navigate(`/growth/${id}`);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDate(e.target.value);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center bg-[#FFEC8A]">
      <CommonHeader title="성장 일지" />

      <div className="w-full flex flex-col items-center mt-16 flex-grow">
        <InfoSection
          description1="교사가 전하는"
          main1="아이의 성장"
          main2=" 이야기"
          imageSrc={daramgi}
          altText="다람쥐"
        />

        <div
          ref={divRef}
          className="w-full bg-white rounded-tl-[20px] rounded-tr-[20px] px-12 shadow-top flex-grow overflow-hidden animate-slideUp"
          style={{ marginTop: '-40px' }}
        >
          <SearchDateBar searchDate={searchDate} handleDateChange={handleDateChange} />
          <GrowthList entries={filteredEntries} handleBoxClick={handleBoxClick} scroll={scroll} />
        </div>
      </div>
    </div>
  );
}
