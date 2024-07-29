import {
    Button,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogCloseButton,
    AlertDialogBody,
    AlertDialogFooter,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from '../../stores/userStore';
import { stopLive } from "../../api/openvidu";

interface LiveStopAlertDialogProps {
    isOpen: boolean;
    handleClick: () => void;
    setStream: React.Dispatch<React.SetStateAction<boolean>>;
    leaveSession: () => void;
}

function LiveStopAlertDialog({
    isOpen,
    handleClick,
    setStream,
    leaveSession,
}: LiveStopAlertDialogProps) {
    const cancelRef = React.useRef(null);
    const navigate = useNavigate();

    const accessToken = useUserStore((state) => state.accessToken);
    const { roomId } = useParams() as { roomId: string };
    const liveBroadcastId = parseInt(roomId);

    function handleStopLive() {
        console.log("LiveStopAlertDialog handleStopLive");
        setStream(false);
        leaveSession();
        stopLive({ accessToken, liveBroadcastId })
            .then(() => {
                navigate("/");
            })
            .catch(() => {
                console.log("handleStopLive stopLive error");
                navigate("/");
            });
    }

    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRef}
                onClose={handleClick}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader>방송 종료</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>방송을 종료하시겠습니까?</AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={handleClick}>
                            취소
                        </Button>
                        <Button
                            colorScheme="themeGreen"
                            ml={3}
                            onClick={handleStopLive}
                        >
                            종료
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default LiveStopAlertDialog;
