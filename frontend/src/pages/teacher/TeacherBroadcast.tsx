import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import TeacherHeader from '../../components/teacher/common/TeacherHeader';
import BroadcastScreen from '../../components/openvidu/Screen';
import { OpenVidu } from 'openvidu-browser';
import { getLiveStartToken, getLiveJoinToken } from '../../api/openvidu';
import { useUserStore } from '../../stores/userStore';

function Broadcast() {
  const { teacherId, parentId } = useParams<{ teacherId: string; parentId: string }>();
  const [stream, setStream] = useState(true);
  const [session, setSession] = useState(null);
  const [OV, setOV] = useState(null);
  const accessToken = localStorage.getItem('accesstoken');

  useEffect(() => {
    const initSession = async () => {
      try {
        const ov = new OpenVidu();
        setOV(ov);
        const session = ov.initSession();
        setSession(session);

        session.on('streamCreated', event => {
          const subscriber = session.subscribe(event.stream, 'video-container');
          // Add additional logic if needed, e.g., handling the stream or attaching it to a video element
        });

        // Create a unique roomId using teacherId and parentId
        const roomId = `${teacherId}-${parentId}`;

        let token;
        if (teacherId === 'teacher123') {
          // 교사가 방을 생성하는 경우
          console.log('방 생성');
          
          token = await getLiveStartToken({ accessToken, roomId });
          console.log(token);
        } else {
          // 사용자가 방에 참여하는 경우
          token = await getLiveJoinToken({ accessToken, roomId });
          console.log('방 참여');
          console.log(token);
        }

        // Ensure token is valid and not undefined
        if (!token) {
          throw new Error('Token is undefined or invalid');
        }

        await session.connect(token, { clientData: parentId });
        console.log(`Connected to the session with Teacher ID: ${teacherId}, Parent ID: ${parentId}`);
      } catch (error) {
        console.error('Error connecting to the session:', error);
      }
    };

    if (teacherId && parentId) {
      initSession();
    }

    return () => {
      if (session) {
        session.disconnect();
      }
    };
  }, [teacherId, parentId, accessToken]);

  return (
    <Flex direction="column" h="100vh">
      <TeacherHeader />
      <Flex flex="1" overflow="hidden" id="video-container">
        <BroadcastScreen stream={stream} setStream={setStream} />
      </Flex>
    </Flex>
  );
}

export default Broadcast;
