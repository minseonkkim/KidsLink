import { OpenVidu, Publisher, Session, Subscriber } from "openvidu-browser";
import { Button, Flex, Text } from "@chakra-ui/react";
import UserVideoComponent from "./UserVideoComponent";
import { useCallback, useEffect, useState } from "react";
import { getLiveStartToken, getLiveJoinToken } from "../../api/openvidu";
import { useParams } from "react-router-dom";
import React from "react";
import { useUserStore } from "../../stores/userStore";
import LiveStopAlertDialog from "./LiveStopAlertDialog";

interface OpenViduComponentProps {
    type: string;
    stream: boolean;
    setStream: React.Dispatch<React.SetStateAction<boolean>>;
}

function OpenViduComponent({
    type,
    stream,
    setStream,
}: OpenViduComponentProps) {
    const [session, setSession] = useState<Session | null>(null);
    const [subscribers, setSubscribers] = useState<Subscriber[] | null>(null);
    const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
    const [publisher, setPublisher] = useState<Publisher | null>(null);
    const [OV, setOV] = useState<OpenVidu | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const accessToken = useUserStore((state) => state.accessToken);
    const { roomId } = useParams() as { roomId: string };
    const liveBroadcastId = parseInt(roomId);

    console.log("OpenViduComponent");

    const leaveSession = useCallback(() => {
        console.log("OpenViduComponent leaveSession");
        if (session) {
            console.log("OpenViduComponent leaveSession session disconnect");
            session.disconnect();
        }
        setSession(null);
        setSubscribers(null);
        setPublisher(null);
        setOV(null);
        setStream(false);
    }, [session]);

    const joinSession = () => {
        // if (OV != null) return;
        const OVs = new OpenVidu();
        setOV(OVs);
        setSession(OVs.initSession());
    };

    //종료 버튼 누르면 session도 날라가도록 useEffect 설정
    useEffect(() => {
        console.log("OpenViduComponent useEffect stream");
        console.log(stream);
        if (!stream) {
            console.log("OpenViduComponent useEffect stream false");
            leaveSession();
        }
    }, [leaveSession, stream]);

    useEffect(() => {
        console.log("useEffect eventListener");
        window.addEventListener("beforeunload", leaveSession);

        return () => {
            // window.removeEventListener("beforeunload", leaveSession);
        };
    }, [leaveSession]);

    useEffect(() => {
        if (session === null) return;

        console.log("useEffect session");
        session.on("streamDestroyed", (event) => {
            console.log("useEffect streamDestroyed");
            if (subscribers === null) return;
            const stream = event.stream;
            const index = subscribers.findIndex(
                (subscriber) => subscriber.stream === stream
            );
            if (index !== -1) {
                const newSubscribers = [...subscribers].splice(index, 1);
                setSubscribers(newSubscribers);
            }
            setSubscriber(null);
        });

        session.on("streamCreated", (event) => {
            console.log("useEffect streamCreated");
            const stream = session.subscribe(event.stream, undefined);
            setSubscriber(stream);
            setSubscribers(subscribers ? [...subscribers, stream] : [stream]);
        });
    }, [session, subscribers]);

    useEffect(() => {
        if (!stream) return;
        // if (session === null && stream) {
        //     console.log("initial joinSession");
        //     joinSession();
        // }

        async function getToken(): Promise<string> {
            try {
                console.log("getToken session check");
                let token = "";

                if (session === null) {
                    console.log("getToken session is null");
                    joinSession();
                } else {
                    if (type === "broadcast") {
                        const test_data = {
                            accessToken,
                            liveBroadcastId,
                        };
                        token = await getLiveStartToken(test_data);
                    } else {
                        const test_data = {
                            liveBroadcastId,
                        };
                        token = await getLiveJoinToken(test_data);
                    }
                }
                return token;
            } catch (error) {
                return Promise.reject(error);
            }
        }

        console.log("useEffect getToken start");
        getToken()
            .then((token) => {
                if (!session) {
                    console.log("session is null");
                    return Promise.reject("session is null");
                }
                session
                    .connect(token)
                    .then(() => {
                        if (!OV) {
                            return Promise.reject("OV is not initialized");
                        }
                        console.log("useEffect getToken session connect");
                        if (type === "live") return;
                        const publishers = OV.initPublisher(undefined, {
                            audioSource: undefined,
                            videoSource: undefined,
                            publishAudio: true,
                            publishVideo: true,
                            mirror: true,
                            resolution: "360x720", // The resolution of your video
                            frameRate: 30, // The frame rate of your video
                        });

                        console.log("session connect setPublishers");
                        console.log(publishers);
                        setPublisher(publishers);
                        session
                            .publish(publishers)
                            .then(() => {
                                console.log("session publish publishers");
                            })
                            .catch((e) => {
                                console.log("session publish error");
                                return Promise.reject(e);
                            });
                    })
                    .catch((e) => {
                        console.log("session connect error");
                        return Promise.reject(e);
                    });
            })
            .catch((e) => {
                console.log("getToken error");
                console.log(e);
            });
    }, [session]);

    function handleClick() {
        setIsOpen(!isOpen);
    }

    function View() {
        if (type === "broadcast" && publisher !== null) {
            return (
                <>
                    <Flex justifyContent={"space-between"}>
                        <Text fontSize="2xl" fontWeight="bold" mb={4}>
                            방송화면
                        </Text>
                        <LiveStopAlertDialog
                            isOpen={isOpen}
                            handleClick={handleClick}
                            setStream={setStream}
                            leaveSession={leaveSession}
                        />

                        <Button colorScheme="red" onClick={handleClick} mb={2}>
                            방송종료
                        </Button>
                    </Flex>
                    <UserVideoComponent streamManager={publisher} />
                </>
            );
        } else if (type === "live" && subscriber !== null) {
            return <UserVideoComponent streamManager={subscriber} />;
        } else return null;
    }
    return <View />;
}

export default OpenViduComponent;