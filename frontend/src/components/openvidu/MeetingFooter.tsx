import {
    Mic,
    MicOff,
    Videocam,
    VideocamOff,
    VolumeOff,
    VolumeUp,
  } from "@mui/icons-material";
  import { Slider } from "@mui/material";
  import React from "react";
  import styled from "styled-components";
import { Button } from "./styled";
  
  
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
      <Footer>
        <LeftDiv>
          <ImgButton>
            {control.video ? (
              <Videocam
                fontSize="large"
                sx={{ cursor: "pointer" }}
                onClick={() => handleControl((prev) => ({ ...prev, video: false }))}
              />
            ) : (
              <VideocamOff
                fontSize="large"
                onClick={() => handleControl((prev) => ({ ...prev, video: true }))}
                sx={{ opacity: "0.5", cursor: "pointer" }}
              />
            )}
            비디오 {control.video ? " 중지" : " 시작"}
          </ImgButton>
          <VerticalLine />
          <ImgButton>
            {control.mic ? (
              <Mic
                fontSize="large"
                onClick={() => handleControl((prev) => ({ ...prev, mic: false }))}
                sx={{ cursor: "pointer" }}
              />
            ) : (
              <MicOff
                fontSize="large"
                onClick={() => handleControl((prev) => ({ ...prev, mic: true }))}
                sx={{ opacity: "0.5", cursor: "pointer" }}
              />
            )}
            음소거 {control.mic ? "" : " 해제"}
          </ImgButton>
          <VerticalLine />
          <VolumeDiv>
            {control.muted ? (
              <VolumeOff
                fontSize="large"
                onClick={() => handleControl((prev) => ({ ...prev, muted: false }))}
                sx={{ opacity: "0.5", cursor: "pointer" }}
              />
            ) : (
              <VolumeUp
                fontSize="large"
                onClick={() => handleControl((prev) => ({ ...prev, muted: true }))}
                sx={{ cursor: "pointer" }}
              />
            )}
            <Slider
              value={control.volume}
              step={0.1}
              min={0.0}
              max={1.0}
              onChange={(event, newVal) =>
                handleControl((prev) => ({ ...prev, volume: newVal as number }))
              }
              sx={{ width: "200px" }}
              disabled={control.muted}
            />
          </VolumeDiv>
        </LeftDiv>
        <RightDiv>
          <Button
            $background_color="#F05050"
            color="white"
            style={{ width: "120px", fontSize: "1.1rem" }}
            onClick={close}
          >
            상담종료
          </Button>
        </RightDiv>
      </Footer>
    );
  };
  
  export default MeetingFooter;
  
  const Footer = styled.div`
    background-color: #2e2f39;
    box-sizing: border-box;
    width: 100%;
    height: 152px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    gap: 16px;
    color: white;
  `;
  
  const LeftDiv = styled.div`
    display: flex;
    align-items: stretch;
    gap: 16px;
  `;
  
  const RightDiv = styled.div`
    display: flex;
  `;
  
  const ImgButton = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    width: 88px;
  `;
  
  const VolumeDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  
  const VerticalLine = styled.div`
    background-color: white;
    width: 1px;
  `;
  