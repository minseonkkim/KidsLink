import React from "react";
import { useNavigate } from "react-router-dom";
import ParentHeader from "../../components/parent/main/ParentHeader";

import daramgi from "../../assets/parent/daramgi.png";

import mailbox from "../../assets/parent/mailbox.png";
import openedFolder from "../../assets/parent/opened-folder.png";
import picture from "../../assets/parent/picture.png";
import shuttleBus from "../../assets/parent/shuttle-bus.png";
import videoConference from "../../assets/parent/video-conference.png";
import productDocuments from "../../assets/parent/product-documents.png";

const services = [
  { src: mailbox, label: "알림장", link: "/notice" },
  { src: openedFolder, label: "성장일지", link: "/growth" },
  { src: picture, label: "앨범", link: "/album" },
  { src: shuttleBus, label: "등하원" },
  { src: videoConference, label: "상담", link: "/meeting" },
  { src: productDocuments, label: "문서공유", link: "/document" },
];

const ParentHome: React.FC = () => {
  const navigate = useNavigate();

  const handleServiceClick = (link?: string) => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffec8a]">
      <ParentHeader />
      <div className="flex flex-1 flex-col justify-center items-center">
        <div className="w-full max-w-[412px] md:px-0">
          <div className="flex items-center justify-center mt-4">
            <div className="text-left mr-4">
              <p className="text-[6vw] md:text-[31px] font-bold text-[#212121]">
                김민선 학부모님
              </p>
              <p className="text-[6vw] md:text-[31px] font-medium text-[#212121]">
                만나서 반가워요!
              </p>
            </div>
            <img
              src={daramgi}
              className="w-full h-auto max-w-[150px] object-cover"
            />
          </div>
          <div
            className="w-full bg-white rounded-tl-[20px] rounded-tr-[20px] py-8 px-14 shadow-top"
            style={{ minHeight: "70vh" }}
          >
            <p className="text-center text-[4vw] md:text-[22px] font-bold text-[#212121] mt-2 mb-8">
              어떤 서비스가 필요하세요?
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              {services.map((service) => (
                <div
                  key={service.label}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleServiceClick(service.link)}
                >
                  <div className="w-[110px] h-[90px] flex items-center justify-center bg-[#FFF9D7] rounded-full hover:bg-[#FFEC8A] transition-all duration-200">
                    <img
                      src={service.src}
                      className="w-[60px] h-[60px] object-contain"
                    />
                  </div>
                  <p className="text-center text-lg font-medium text-[#212121] mt-2">
                    {service.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentHome;
