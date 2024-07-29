import { Box, Text } from "@chakra-ui/layout";
import { useState } from "react";
import OpenViduComponent from "./OpenviduComponent";

interface BroadcastScreenProps {
    stream: boolean;
    setStream: React.Dispatch<React.SetStateAction<boolean>>;
}

function BroadcastScreen({ stream, setStream }: BroadcastScreenProps) {
    console.log("BroadcastScreen");
    const [flag, setFlag] = useState(true);
    const activateOpenVidu = () => {
        console.log("activateOpenVidu", flag);
        if (flag) {
            setFlag(false);
        } else {
            setFlag(true);
        }
        console.log("flag", flag);
    };
    return (
        <Box w={"33%"} flex="1" overflow="auto" p={6}>
            <Text
                marginTop="100px"
                fontSize="2xl"
                fontWeight="bold"
                mb={4}
                onClick={activateOpenVidu}
            >
                방송화면
            </Text>
            <Box bg="gray.200" rounded="md" h="84vh" />
            {flag ? (
                <OpenViduComponent
                    type="broadcast"
                    stream={stream}
                    setStream={setStream}
                />
            ) : null}
        </Box>
    );
}

export default BroadcastScreen;