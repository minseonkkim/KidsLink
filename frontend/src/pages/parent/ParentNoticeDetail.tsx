import { useParams } from "react-router-dom";
import CommonHeader from "../../components/parent/common/CommonHeader";

import profileImg from "../../assets/parent/notice-daramgi.png";

const notices = [
  {
    id: 1,
    date: "2024.07.15 (월)",
    title: "딸기농장 현장실습",
    bgColor: "#fff9d7",
    content: `안녕하세요. 이번주 금요일에 아이들이 기다리던 딸기 농장으로 현장학습을 갑니다. 아래의 일정을 참고해주시고, 필요한 준비물을 챙겨주세요.
    일시: 이번주 금요일, 7월 19일
    장소: 딸기 농장
    출발 시간: 오전 9시 (유치원 정문 앞에서 출발합니다. 늦지 않게 도착해주세요.)
    도착 시간: 오후 3시 (유치원 정문 앞에서 마칠 예정입니다.)
    준비물: 도시락 및 간식, 물병, 모자, 편한 복장 및 운동화, 비닐봉투 (딸기 수확용)
    아이들이 안전하고 즐거운 시간을 보낼 수 있도록 학부모님들의 많은 협조 부탁드립니다. 만약 특별한 주의사항이 있거나 문의사항이 있으시면 유치원으로 연락주시기 바랍니다.
    감사합니다.`,
  },
  {
    id: 2,
    date: "2024.07.12 (금)",
    title: "전통 놀이의 날",
    bgColor: "#f9fafc",
    content: "전통 놀이의 날 관련 내용입니다.",
  },
  // 다른 알림 내용들 추가
];

const ParentNoticeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const notice = notices.find(
    (notice) => notice.id === parseInt(id || "0", 10)
  );

  if (!notice) {
    return <p>해당 알림장을 찾을 수 없습니다.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <CommonHeader title="알림장" />
      <div className="flex flex-1 flex-col my-16 items-center px-6">
        <div className="relative w-full mt-4 mb-12">
          <div className="flex items-center my-6">
            <div className="w-[40px] h-[40px] mr-2">
              <img
                src={profileImg}
                className="w-full h-full object-cover rounded-full"
                alt="프로필 이미지"
              />
            </div>
            <p className="text-lg font-medium text-[#353c4e]">개나리반 선생님</p>
          </div>

          <div className="relative w-full bg-[#fff9d7] rounded-[20px] px-6 py-8 shadow-lg border-2 border-[#ffec8a] bg-notebook-pattern">
            {/* 테이프 효과 */}
            <div className="absolute -top-4 -left-4 w-16 h-8 bg-yellow-300 rotate-12 transform z-10"></div>
            <div className="absolute -top-4 -right-4 w-16 h-8 bg-yellow-300 -rotate-12 transform z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-8 bg-yellow-300 -rotate-12 transform z-10"></div>
            <div className="absolute -bottom-4 -right-4 w-16 h-8 bg-yellow-300 rotate-12 transform z-10"></div>

            <p className="text-xl font-bold text-[#212121] mb-2">
              {notice.title}
            </p>
            <p className="text-sm font-light text-[#353c4e] mb-6">
              {notice.date}
            </p>
            <div className="text-base text-[#212121] space-y-4 whitespace-pre-line">
              {notice.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentNoticeDetail;
