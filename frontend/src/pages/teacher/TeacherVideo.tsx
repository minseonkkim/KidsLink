import { useLocation, useParams } from "react-router-dom";
import React, { ChangeEvent, useEffect, useState } from "react";
import OpenViduVideoComponent from "../../components/openvidu/VideoComponent";
import { handleSpeechRecognition, stopRecording } from "../../api/openvidu";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import MeetingBackground from "../../assets/teacher/meeting_background.png";
import useTeacherInfoStore from "../../stores/useTeacherInfoStore";
import { getTeacherInfo } from "../../api/Info";
import TeacherMeetingFooter from "../../components/openvidu/TeacherMeetingFooter";
import { ControlState, OpenViduState, Recording, TabState, User } from "../../types/openvidu";
import { fetchRecordingsList, joinSession, leaveSession } from "../../utils/openvidu";

export default function TeacherVideo() {
  const location = useLocation();
  const { parentName } = location.state || {};
  const { meetingId } = useParams<{ meetingId: string }>();
  const { teacherInfo, setTeacherInfo } = useTeacherInfoStore();
  const [user, setUser] = useState<User>({
    sessionId: meetingId,
    username: teacherInfo?.name || "",
  });
  const [openvidu, setOpenvidu] = useState<OpenViduState>({
    session: undefined,
    mainStreamManager: undefined,
    publisher: undefined,
    subscribers: [],
  });
  const [tabOpen, setTabOpen] = useState<TabState>({
    formTab: false,
    profileTab: false,
    chatTab: false,
  });
  const [control, setControl] = useState<ControlState>({
    video: false,
    mic: false,
    muted: false,
    volume: 0.2,
  });
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentRecordingId, setCurrentRecordingId] = useState<string | null>(null);
  const [isSessionJoined, setIsSessionJoined] = useState(false);
  const [myStreamId, setMyStreamId] = useState<string | undefined>(undefined);
  const [otherVideoActive, setOtherVideoActive] = useState(false);

  useEffect(() => {
    async function fetchTeacherInfo() {
      try {
        const fetchedTeacherInfo = await getTeacherInfo();
        setTeacherInfo(fetchedTeacherInfo);
        setUser((prevUser) => ({ ...prevUser, username: fetchedTeacherInfo.name }));
      } catch (error) {
        console.error("Failed to fetch teacher info:", error);
      }
    }

    if (!teacherInfo) {
      fetchTeacherInfo();
    } else {
      setUser((prevUser) => ({ ...prevUser, username: teacherInfo.name }));
    }
  }, [teacherInfo, setTeacherInfo]);

  useEffect(() => {
    fetchRecordingsList(setRecordings);
  }, []);

  useEffect(() => {
    if (openvidu.publisher) {
      openvidu.publisher.publishAudio(control.mic);
      openvidu.publisher.publishVideo(control.video);
    }
  }, [control, openvidu.publisher]);

  useEffect(() => {
    if (isSessionJoined) {
      handleSpeechRecognition(user.sessionId, setCurrentRecordingId);
    }
  }, [isSessionJoined, user.sessionId]);

  const handleUserChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUser((prevUser) => ({ ...prevUser, [event.target.name]: event.target.value }));
  };

  const handleStopRecording = async () => {
    if (currentRecordingId) {
      try {
        const stoppedRecording = await stopRecording(currentRecordingId);
        console.log(`Recording stopped: ${stoppedRecording.id}`);
        setCurrentRecordingId(null);
        fetchRecordingsList(setRecordings);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  // 상대방 비디오 상태에 따라 불투명도 설정
  const teacherVideoOpacity = control.video ? 1 : 0.8;
  const parentVideoOpacity = otherVideoActive ? 1 : 0.8;

  return (
    <div className="relative flex flex-col justify-center items-center w-screen h-screen min-w-[1000px] overflow-hidden">
      <img src={MeetingBackground} className="absolute top-0 left-0 w-full h-full object-cover" />
      <div className="relative z-10 w-full h-full flex flex-col items-center">
        <TeacherHeader />
        {openvidu.session ? (
          <div className="relative w-full h-full flex">
            <div
              className="absolute top-[200px] left-[100px] w-[800px] h-auto rounded-lg bg-white"
              style={{ opacity: teacherVideoOpacity, backgroundColor: "white" }}
            >
              {!control.video && (
                <div className="absolute z-50 text-white text-opacity-100">교사</div>
              )}
              {openvidu.mainStreamManager && (
                <OpenViduVideoComponent streamManager={openvidu.mainStreamManager} />
              )}
            </div>
            <div
              className="absolute top-[200px] right-[100px] w-[800px] h-auto rounded-lg bg-white"
              style={{ opacity: parentVideoOpacity, backgroundColor: "white" }}
            >
              {!otherVideoActive && (
                <div className="absolute z-50 text-white text-opacity-100">학부모</div>
              )}
              <OpenViduVideoComponent
                streamManager={openvidu.subscribers[0]}
                muted={control.muted}
                volume={control.volume}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center w-full h-full">
            <div className="bg-white p-5 rounded-xl drop-shadow-md bg-[#]">
              <p>상담번호 : {user.sessionId}</p>
              <p>참가자 : {user.username}</p>
              <p>안내문안내문안내문안내문안내문안내문</p>
              <div className="flex justify-center mt-2">
                <button
                  onClick={() =>
                    joinSession(
                      user,
                      setOpenvidu,
                      setIsSessionJoined,
                      setMyStreamId,
                      setOtherVideoActive
                    )
                  }
                  className="w-[70px] h-[38px] border-[2px] border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[8px] hover:bg-[#D4DDEA]"
                >
                  연결
                </button>
              </div>
            </div>
          </div>
        )}
        {isSessionJoined && (
          <TeacherMeetingFooter
            control={control}
            handleControl={setControl}
            close={() => leaveSession(openvidu, setOpenvidu, setIsSessionJoined)}
            stopRecording={handleStopRecording}
            isRecording={!!currentRecordingId}
          />
        )}
        <div className="recordings-list mt-4">
          <h2>녹화 파일 목록</h2>
          <ul>
            {recordings.map((recording) => (
              <li key={recording.id}>
                {recording.name} -{" "}
                <a href={recording.url} target="_blank" rel="noopener noreferrer">
                  다운로드
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
