import { ControlBar, LiveKitRoom } from '@livekit/components-react';


const MyLiveKit = () => {
  const serverUrl = '';
  const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjExODQ0MTMsImlzcyI6IkFQSUVvOUpFZFlSS1l0USIsIm5iZiI6MTcyMTE4MzUxMywic3ViIjoiaXNhbXRhbGsiLCJ2aWRlbyI6eyJjYW5QdWJsaXNoIjp0cnVlLCJjYW5QdWJsaXNoRGF0YSI6dHJ1ZSwiY2FuU3Vic2NyaWJlIjp0cnVlLCJyb29tIjoiaXNhbXRhbGsiLCJyb29tSm9pbiI6dHJ1ZX19.7MToMgOA2U8H0T05VYunUEuBKVXrAb9ZPtUjdAVT6p4';
  
  const controlBarControls = {
    microphone: true,
    camera: true,
    chat: true,
    screenShare: true,
    leave: true,
    settings: true,
  };

  return (
    <div>
      <LiveKitRoom serverUrl={serverUrl} token={accessToken} connect={true}>
        <ControlBar controls={controlBarControls}/>
      </LiveKitRoom>
    </div>
  );
};

export default MyLiveKit;
