import { Flex } from "@chakra-ui/layout";

import { useState } from "react";
import React from "react";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import BroadcastScreen from "../../components/openvidu/Screen";

function Broadcast() {
    const [stream, setStream] = useState(true);
    return (
        <Flex direction="column" h="100vh">
            <TeacherHeader />
            <Flex flex="1" overflow="hidden">
                <BroadcastScreen stream={stream} setStream={setStream} />
            </Flex>
        </Flex>
    );
}

export default Broadcast;