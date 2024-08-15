import { OpenVidu, Publisher, Session, StreamEvent, StreamManager, Subscriber } from "openvidu-browser";

export interface User {
    sessionId?: string;
    username: string;
    classname?: string;
    profile?: string;
  }
  
export interface OpenViduState {
    session?: Session;
    mainStreamManager?: StreamManager;
    publisher?: Publisher;
    subscribers: Subscriber[];
  }
  
export interface TabState {
    formTab: boolean;
    profileTab: boolean;
    chatTab: boolean;
  }
  
export interface ControlState {
    video: boolean;
    mic: boolean;
    muted: boolean;
    volume: number;
  }
  
export interface Recording {
    id: string;
    name: string;
    url: string; // Assuming the URL to access the recording is available
    createdAt: number;
  }