import { StreamManager } from "openvidu-browser";
import { useEffect, useRef, useState } from "react";

function OpenViduVideoComponent({
    streamManager,
}: {
    streamManager: StreamManager;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [mute, setMute] = useState<boolean>(true);
    useEffect(() => {
        if (streamManager && videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);
    function handleClick() {
        setMute(false);
    }
    return (
        <video
            autoPlay={true}
            muted={mute}
            ref={videoRef}
            onClick={handleClick}
            style={{ objectFit: "cover" }}
        ></video>
    );
}

export default OpenViduVideoComponent;