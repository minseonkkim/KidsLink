import { StreamManager } from "openvidu-browser";
import OpenViduVideoComponent from "./OpenviduVideoComponent";


function UserVideoComponent({
    streamManager,
}: {
    streamManager: StreamManager;
}) {
    console.log("UserVideoComponent streamManager");
    console.log(streamManager);
    return (
        <>
            {streamManager !== undefined ? (
                <div className="streamcomponent" style={{ height: "100%" }}>
                    <OpenViduVideoComponent streamManager={streamManager} />
                </div>
            ) : null}
        </>
    );
}

export default UserVideoComponent;