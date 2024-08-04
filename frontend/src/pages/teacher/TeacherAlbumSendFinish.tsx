
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { BsSendCheck } from "react-icons/bs";
import React, { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext, useNavigate } from 'react-router-dom';
import { createBrowserHistory } from 'history';

export default function TeacherAlbumSendFinish() {
  const { navigator } = useContext(UNSAFE_NavigationContext);
  const navigate = useNavigate();
  const history = createBrowserHistory();

  useEffect(() => {
    const unlisten = history.listen(({ action }) => {
      if (action === 'POP') {
        // Do your stuff on back button click
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
        <div className="font-bold text-[23px] flex flex-col items-center justify-center mt-[150px]">
            <div className="flex flex-row items-center">
                <BsSendCheck className="mr-5 text-[25px]"/>
                <span>앨범이 학부모에게 성공적으로 전송되었습니다!</span>
            </div>
            <span></span>
        </div>
    </div>
    </>
}