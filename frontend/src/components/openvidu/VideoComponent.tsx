import React, { Component, createRef, RefObject } from "react";
import { StreamManager } from "openvidu-browser";

interface OpenViduVideoComponentProps {
  streamManager: StreamManager;
  volume?: number;
  muted?: boolean;
}

export default class OpenViduVideoComponent extends Component<OpenViduVideoComponentProps> {
  private videoRef: RefObject<HTMLVideoElement>;

  constructor(props: OpenViduVideoComponentProps) {
    super(props);
    this.videoRef = createRef<HTMLVideoElement>();
  }

  componentDidUpdate(prevProps: OpenViduVideoComponentProps) {
    if (this.videoRef.current && this.props.streamManager !== prevProps.streamManager) {
      this.props.streamManager.addVideoElement(this.videoRef.current);
      const media = this.videoRef.current;
      if (this.props.volume !== undefined) {
        media.volume = this.props.volume;
      }
    }
  }

  componentDidMount() {
    if (this.videoRef.current) {
      this.props.streamManager.addVideoElement(this.videoRef.current);
      const media = this.videoRef.current;
      if (this.props.volume !== undefined) {
        media.volume = this.props.volume;
      }
    }
  }

  render() {
    return (
      <video
        style={{ height: "100%", width: "100%", borderRadius: "8px" }}
        autoPlay={true}
        muted={this.props.muted}
        ref={this.videoRef}
      />
    );
  }
}
