
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { BsSendCheck } from "react-icons/bs";
import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext, useNavigate } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Link } from "react-router-dom";

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

    return <>
    <TeacherHeader/>
      <div className="px-[150px] mt-[120px]">
        <NavigateBack backPage="홈" backLink='/'/>
        <Title title="사진분류"/>
        <div className="flex flex-col items-center justify-center mt-[160px]">
            <div className="flex flex-row items-center font-bold text-[24px] mb-3">
                <BsSendCheck className="mr-5 text-[26px]"/>
                <span>앨범이 학부모에게 성공적으로 전송되었습니다!</span>
            </div>
            <Link to="/album/history"><div className="cursor-pointer text-[#8CAD1E] text-[18px]">전송내역보기</div></Link>
        </div>
    </div>
    </>
}