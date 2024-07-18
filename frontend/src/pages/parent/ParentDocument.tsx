import React, { useState } from "react";
import CommonHeader from "../../components/parent/common/CommonHeader";

import daramgi from "../../assets/parent/document-daramgi.png";
import pill from "../../assets/parent/pill.png";
import absentIcon from "../../assets/parent/absent.png";
import checkedIcon from "../../assets/parent/check.png";
import handWithPen from "../../assets/parent/pen.png";

const documents = [
  {
    date: "2024.07.13 - 2024.07.25",
    title: "감기약",
    type: "med",
    checked: false,
    bgColor: "bg-[#fff9d7]",
    hoverColor: "hover:bg-[#ffec8a]",
  },
  {
    date: "2024.07.13 - 2024.07.25",
    title: "불국사 견학",
    type: "absent",
    checked: true,
    bgColor: "bg-[#f9fafc]",
    hoverColor: "hover:bg-[#e0e0e0]",
  },
];

const ParentDocument: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffec8a]">
      <CommonHeader title="서류" />
      <div className="flex flex-1 flex-col justify-center items-center">
        <div className="w-full max-w-[455px] md:px-0">
          <div className="flex items-center justify-center mt-4">
            <div className="text-left mr-4">
              <p className="text-[6vw] md:text-[27px] font-medium text-[#212121]">
                교사가 알아야 할
              </p>
              <p className="text-[6vw] md:text-[27px] font-bold text-[#212121]">
                아이의 소식
              </p>
              <p className="text-[6vw] md:text-[27px] font-medium text-[#212121]">
                을 알려주세요!
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
            <div className="flex items-center justify-between mb-6">
              <input
                type="text"
                placeholder="🔍︎"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-[#FDDA6E]"
              />
            </div>
            <div className="space-y-6">
              {filteredDocuments.map((doc, index) => (
                <div
                  key={index}
                  className={`flex flex-col p-4 rounded-2xl ${doc.bgColor} ${doc.hoverColor} transition-colors duration-200`}
                >
                  <div className="flex items-center">
                    <img
                      src={doc.type === "med" ? pill : absentIcon}
                      alt={doc.type === "med" ? "pill" : "absent"}
                      className="w-[30px] h-[30px] mr-4"
                    />
                    <div>
                      <p className="text-lg font-bold text-[#757575]">
                        {doc.date}
                      </p>
                      <p className="text-[22px] font-bold text-[#353c4e]">
                        {doc.title}
                      </p>
                    </div>
                    {doc.checked && (
                      <img
                        src={checkedIcon}
                        alt="checked"
                        className="w-[30px] h-[30px] ml-auto object-contain"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed right-10 z-50 bottom-20 md:bottom-16">
        <div
          className="w-[70px] h-[70px] rounded-full bg-[#ffec8a] flex items-center justify-center"
          style={{
            boxShadow:
              "0px 13px 27px -5px rgba(50,50,93,0.25), 0px 8px 16px -8px rgba(0,0,0,0.3)",
          }}
        >
          <img
            src={handWithPen}
            alt="hand with pen"
            className="w-[35px] h-[35px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ParentDocument;
