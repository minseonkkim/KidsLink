import React from "react";
import styled from "styled-components";
import axiosInstance from "../../api/token/axiosInstance";
import useChatRoomStore from "../../stores/userStore";


interface MeetingHeaderProps {
  tabOpen: {
    formTab: boolean;
    profileTab: boolean;
    chatTab: boolean;
  };
  handleTabOpen: (update: (prev: MeetingHeaderProps['tabOpen']) => MeetingHeaderProps['tabOpen']) => void;
  meetingNo: number;
}

const MeetingHeader: React.FC<MeetingHeaderProps> = ({ tabOpen, handleTabOpen, meetingNo }) => {
  const { setRoom } = useChatRoomStore();
  const memberName = "사용자 이름"; // 적절한 사용자 이름을 여기에 넣으세요.

  const handleChatTabClick = () => {
    axiosInstance
      .get(`chat/room/meet/${meetingNo}`)
      .then((res) => {
        console.log(res);
        const roomData = res.data;
        const roomName = roomData.generalName === memberName ? roomData.shelterName : roomData.generalName;
        setRoom(roomData.roomNo, roomName);
        handleTabOpen((prev) => ({ ...prev, chatTab: !prev.chatTab }));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Header>
      <Div>
        <Span
          $active={tabOpen.formTab}
          onClick={() => handleTabOpen((prev) => ({ ...prev, formTab: !prev.formTab }))}
        >
          상담 신청서
        </Span>
        |
        <Span
          $active={tabOpen.profileTab}
          onClick={() => handleTabOpen((prev) => ({ ...prev, profileTab: !prev.profileTab }))}
        >
          동물 프로필
        </Span>
        |
        <Span $active={tabOpen.chatTab} onClick={handleChatTabClick}>
          채팅 열기
        </Span>
      </Div>
    </Header>
  );
};

export default MeetingHeader;

const Header = styled.div`
  background-color: #2e2f39;
  box-sizing: border-box;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  color: white;
`;

const Div = styled.div`
  display: flex;
  gap: 16px;
`;

const Span = styled.span<{ $active: boolean }>`
  font-weight: bold;
  cursor: pointer;
  ${({ $active }) => $active && "opacity:0.5"};
`;
