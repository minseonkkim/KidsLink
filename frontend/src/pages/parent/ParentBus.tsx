import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../../components/parent/common/CommonHeader";

import daramgi from "../../assets/parent/bus-daramgi.png";

const busStatuses = [
  {
    id: 1,
    date: "2024.07.15 (월)",
    status: "버스가 이동 중입니다.",
  },
  {
    id: 2,
    date: "2024.07.12 (금)",
    status: "버스가 정차 중입니다.",
  },
  {
    id: 3,
    date: "2024.07.11 (목)",
    status: "버스가 출발 준비 중입니다.",
    bgColor: "bg-[#f9fafc]",
    hoverColor: "hover:bg-[#e0e0e0]",
  },
  {
    id: 4,
    date: "2024.07.09 (화)",
    status: "버스가 도착했습니다.",
  },
];

const ParentBus: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBusStatuses, setFilteredBusStatuses] = useState(busStatuses);

  const handleBusClick = (id: number) => {
    navigate(`/bus/${id}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      const filtered = busStatuses.filter((busStatus) => busStatus.status.includes(term));
      setFilteredBusStatuses(filtered);
    } else {
      setFilteredBusStatuses(busStatuses);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffec8a]">
      <CommonHeader title="버스" />
      <div className="flex flex-1 flex-col justify-center items-center">
        <div className="w-full max-w-[455px] md:px-0">
          <div className="flex items-center justify-center mt-4">
            <div className="text-left mr-4">
              <p className="text-[6vw] md:text-[27px] font-bold text-[#212121]">
                버스가
              </p>
              <p className="text-[6vw] md:text-[27px] font-medium text-[#212121]">
                이동 중 입니다!
              </p>
            </div>
              <img
                src={daramgi}
                className="w-full h-auto max-w-[150px] object-cover"
              />
          </div>
          <div
            className="w-full bg-white rounded-tl-[20px] rounded-tr-[20px] p-8 shadow-top"
            style={{ minHeight: "70vh" }}
          >
            <div className="w-full p-4 mt-6">
              {/* 지도 들어갈 자리 */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentBus;
