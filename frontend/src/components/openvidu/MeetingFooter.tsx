import React from "react";
import { IoVideocam, IoVideocamOff, IoVolumeHigh } from "react-icons/io5";
import { CiMicrophoneOff, CiMicrophoneOn } from "react-icons/ci";
import { RxCrossCircled } from "react-icons/rx";
import { VolumeOff, VolumeUp } from "@mui/icons-material";
import { Slider } from "@mui/material";
import { Button } from "./styled"; // Import your styled button
import { IoMdVolumeOff } from "react-icons/io";

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

const MeetingFooter: React.FC<MeetingFooterProps> = ({ control, handleControl, close }) => {
  return (
    <div className="bottom-8 bg-white flex justify-between items-center p-6 text-white rounded-full">
      <div className="flex items-center gap-4">
        <div className="flex flex-col justify-center items-center gap-2 w-22">
          {control.video ? (
            <IoVideocam
              color="black"
              className="cursor-pointer text-3xl"
              onClick={() => handleControl((prev) => ({ ...prev, video: false }))}
            />
          ) : (
            <IoVideocamOff
              color="black"
              className="cursor-pointer opacity-50 text-3xl"
              onClick={() => handleControl((prev) => ({ ...prev, video: true }))}
            />
          )}
        </div>
        <div className="bg-white w-px h-full" />
        <div className="flex flex-col justify-center items-center gap-2 w-22">
          {control.mic ? (
            <CiMicrophoneOn
              color="black"
              className="cursor-pointer text-3xl"
              onClick={() => handleControl((prev) => ({ ...prev, mic: false }))}
            />
          ) : (
            <CiMicrophoneOff
              color="black"
              className="cursor-pointer opacity-50 text-3xl"
              onClick={() => handleControl((prev) => ({ ...prev, mic: true }))}
            />
          )}
        </div>
        <div className="bg-white w-px h-full" />
        <div className="flex items-center gap-2">
          {control.muted ? (
            <IoMdVolumeOff
              className="cursor-pointer opacity-50 text-3xl text-black"
              onClick={() => handleControl((prev) => ({ ...prev, muted: false }))}
            />
          ) : (
            <IoVolumeHigh
              className="cursor-pointer text-3xl text-black"
              onClick={() => handleControl((prev) => ({ ...prev, muted: true }))}
            />
          )}
          <div className="w-48 py-2 items-center">
            <Slider
              value={control.volume}
              step={0.1}
              min={0.0}
              max={1.0}
              onChange={(event, newVal) =>
                handleControl((prev) => ({ ...prev, volume: newVal as number }))
              }
              sx={{ width: '100%' }}
              disabled={control.muted}
            />
          </div>
        </div>
      </div>
      <div>
        <RxCrossCircled
          color="red"
          className="ml-3 text-3xl cursor-pointer"
          onClick={close}
        />
      </div>
    </div>
  );
};

export default MeetingFooter;
