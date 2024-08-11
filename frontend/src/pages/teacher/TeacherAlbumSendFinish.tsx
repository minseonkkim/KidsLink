import Title from "../../components/teacher/common/Title";
import { BsSendCheck } from "react-icons/bs";
import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext, useNavigate } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Link } from "react-router-dom";
import TeacherLayout from "../../layouts/TeacherLayout";
import daramgi from "../../assets/teacher/camera-daramgi.png";

export default function TeacherAlbumSendFinish() {
  const { navigator } = useContext(UNSAFE_NavigationContext);
  const navigate = useNavigate();
  const history = createBrowserHistory();

  useEffect(() => {
    const unlisten = history.listen(({ action }) => {
      if (action === 'POP') {
        navigate('/');
      }
    });

    return () => {
      unlisten();
    };
  }, [history, navigate]);

  const tabs = [
    { label: "사진분류", link: "/album" },
    { label: "전송내역", link: "/album/history" },
];

  return (
    <TeacherLayout
        activeMenu="album"
        setActiveMenu={() => {}}
        titleComponent={<Title 
          title="사진분류" 
          tooltipContent={
            <div className="leading-relaxed w-[240px]">
              업로드한 사진을 AI가 아이별로 분류하고, 해당 아이의 학부모에게 전송합니다. 정상적으로 분류되지 않은 사진은 수동으로 분류할 수 있으니 안심하세요!
            </div>
          }
          tabs={tabs} 
        />}
        imageSrc={daramgi} 
    >
      <div className="px-[150px] mt-[120px]">
        <div className="flex flex-col items-center justify-center mt-[160px]">
            <div className="flex flex-row items-center font-bold text-[24px] mb-3">
                <BsSendCheck className="mr-5 text-[26px]"/>
                <span>앨범이 학부모에게 성공적으로 전송되었습니다!</span>
            </div>
            <Link to="/album/history"><div className="cursor-pointer text-[#8CAD1E] text-[18px]">전송내역보기</div></Link>
        </div>
    </div>
    </TeacherLayout>
  )
}