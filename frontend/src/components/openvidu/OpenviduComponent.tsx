import { OpenVidu, Publisher, Session, Subscriber } from "openvidu-browser";
import { Button, Flex, Text } from "@chakra-ui/react";
import UserVideoComponent from "./UserVideoComponent";
import { useCallback, useEffect, useState } from "react";
import { getLiveStartToken, getLiveJoinToken } from "../../api/openvidu";
import { useParams } from "react-router-dom";
import React from "react";
import { useUserStore } from "../../stores/userStore";

interface OpenViduComponentProps {
    type: string;
    stream: boolean;
    setStream: React.Dispatch<React.SetStateAction<boolean>>;
}

function OpenViduComponent({ type, stream, setStream }: OpenViduComponentProps) {
    const [session, setSession] = useState<Session | null>(null);
    const [subscribers, setSubscribers] = useState<Subscriber[] | null>(null);
    const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
    const [publisher, setPublisher] = useState<Publisher | null>(null);
    const [OV, setOV] = useState<OpenVidu | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const accessToken = useUserStore((state) => state.accessToken);
    const { roomId } = useParams() as { roomId: string };

    const leaveSession = useCallback(() => {
        if (session) {
            session.disconnect();
        }
        setSession(null);
        setSubscribers(null);
        setPublisher(null);
        setOV(null);
        setStream(false);
    }, [session]);

    const joinSession = () => {
        if (OV != null) return;
        const OVs = new OpenVidu();
        setOV(OVs);
        setSession(OVs.initSession());
    };

    useEffect(() => {
        if (!stream) {
            leaveSession();
        }
    }, [leaveSession, stream]);

    useEffect(() => {
        window.addEventListener("beforeunload", leaveSession);
        return () => {
            window.removeEventListener("beforeunload", leaveSession);
        };
    }, [leaveSession]);

    useEffect(() => {
        if (session === null) return;

        session.on("streamDestroyed", (event) => {
            if (subscribers === null) return;
            const stream = event.stream;
            const index = subscribers.findIndex(
                (subscriber) => subscriber.stream === stream
            );
            if (index !== -1) {
                const newSubscribers = [...subscribers];
                newSubscribers.splice(index, 1);
                setSubscribers(newSubscribers);
            }
            setSubscriber(null);
        });

        session.on("streamCreated", (event) => {
            const stream = session.subscribe(event.stream, undefined);
            setSubscriber(stream);
            setSubscribers(subscribers ? [...subscribers, stream] : [stream]);
        });
    }, [session, subscribers]);

    useEffect(() => {
        if (!stream) return;
        if (session === null && stream) {
            joinSession();
        }

        async function getToken(): Promise<string> {
            try {
                let token = "";

                if (session === null) {
                    joinSession();
                } else {
                    if (type === "broadcast") {
                        token = await getLiveStartToken({
                            accessToken,
                            roomId,
                        });
                    } else {
                        token = await getLiveJoinToken({
                            accessToken,
                            roomId,
                        });
                    }
                }
                return token;
            } catch (error) {
                return Promise.reject(error);
            }
        }

        getToken()
            .then((token) => {
                if (!session) {
                    return Promise.reject("session is null");
                }
                session
                    .connect(token)
                    .then(() => {
                        if (!OV) {
                            return Promise.reject("OV is not initialized");
                        }
                        if (type === "live") return;
                        const publishers = OV.initPublisher(undefined, {
                            audioSource: undefined,
                            videoSource: undefined,
                            publishAudio: true,
                            publishVideo: true,
                            mirror: true,
                            resolution: "360x720",
                            frameRate: 30,
                        });

                        setPublisher(publishers);
                        session.publish(publishers);
                    })
                    .catch((e) => {
                        return Promise.reject(e);
                    });
            })
            .catch((e) => {
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