import React from "react";
import { IoVideocam, IoVideocamOff, IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { Slider } from "@mui/material";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { TeacherMeetingFooterProps } from "../../types/meeting";


const TeacherMeetingFooter: React.FC<TeacherMeetingFooterProps> = ({ control, handleControl, close, startRecording, stopRecording, isRecording }) => {

  const isMuted = control.muted || control.volume === 0;

  return (
    <div className="mb-[30px] bg-white flex justify-between items-center px-10 py-3 text-white rounded-full z-50">
      <div className="flex items-center gap-4">
        <div className="flex flex-col justify-center items-center gap-2 w-22">
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
        <div className="bg-white w-px h-full" />
        <div className="flex flex-col justify-center items-center gap-2 w-22">
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
        <div className="bg-white w-px h-full" />
        <div className="flex items-center gap-2">
          {isMuted ? (
            <IoVolumeMute
              className="cursor-pointer text-3xl text-[#B8B8B8] mr-3"
              onClick={() => handleControl((prev) => ({ ...prev, muted: false }))}
            />
          ) : (
            <IoVolumeHigh
              className="cursor-pointer text-3xl text-black mr-3"
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
              sx={{
                width: '100%',
                color: 'yellow',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#FFD700',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#FFD700',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#FFD700',
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          className={`text-2xl ${isRecording ? 'text-red-600' : 'text-black'}`}
          onClick={stopRecording}
        >
           '녹음 중지'
        </button>
        <RxCrossCircled
          className="ml-3 text-3xl cursor-pointer text-red-600"
          onClick={close}
        />
      </div>
    </div>
  );
};

export default TeacherMeetingFooter;
