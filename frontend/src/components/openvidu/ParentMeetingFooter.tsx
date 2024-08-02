import React from "react";
import { IoVideocam, IoVideocamOff, IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { Slider } from "@mui/material";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import TeacherBroadcast from "../../pages/teacher/TeacherVideo";

// Define the types for the props
interface ControlState {
  video: boolean;
  mic: boolean;
  muted: boolean;
  volume: number;
}

interface MeetingFooterProps {
  control: ControlState;
  handleControl: (update: (prev: ControlState) => ControlState) => void;
  close: () => void;
}

const ParentMeetingFooter: React.FC<MeetingFooterProps> = ({ control, handleControl, close }) => {
  const isMuted = control.muted || control.volume === 0;

  return (
    <div className="fixed w-full bottom-[0px] mb-[80px] bg-transparent flex px-10 py-3 text-white rounded-full z-50 justify-center gap-4">
      <div className="flex justify-center items-center w-16 h-16 rounded-full bg-gray-200">
        {control.video ? (
          <IoVideocam
            className="cursor-pointer text-3xl text-black"
            onClick={() => handleControl((prev) => ({ ...prev, video: false }))}
          />
        ) : (
          <IoVideocamOff
            className="cursor-pointer text-[#B8B8B8] text-3xl"
            onClick={() => handleControl((prev) => ({ ...prev, video: true }))}
          />
        )}
      </div>

    <div className="flex flex-col justify-center items-center gap-2 w-22">
      <div className="flex justify-center items-center w-16 h-16 rounded-full bg-gray-200">
        {control.mic ? (
          <FaMicrophone
            className="cursor-pointer text-3xl text-black"
            onClick={() => handleControl((prev) => ({ ...prev, mic: false }))}
          />
        ) : (
          <FaMicrophoneSlash
            className="cursor-pointer text-3xl text-[#B8B8B8]"
            onClick={() => handleControl((prev) => ({ ...prev, mic: true }))}
          />
        )}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="flex justify-center items-center w-16 h-16 rounded-full bg-gray-200">
        {control.muted ? (
          <IoVolumeMute
            className="cursor-pointer text-3xl text-[#B8B8B8]"
            onClick={() => handleControl((prev) => ({ ...prev, muted: false }))}
          />
        ) : (
          <IoVolumeHigh
            className="cursor-pointer text-3xl text-black"
            onClick={() => handleControl((prev) => ({ ...prev, muted: true }))}
          />
        )}
      </div>
    </div>
  <div className="flex flex-col justify-center items-center gap-2 w-22">
    <div className="flex justify-center items-center w-16 h-16 rounded-full bg-gray-200">
      <RxCrossCircled
        className="text-3xl cursor-pointer text-red-600"
        onClick={close}
      />
    </div>
  </div>
</div>
  );
};

export default ParentMeetingFooter;
