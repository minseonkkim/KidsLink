import React, { Component } from 'react';
import { StreamManager } from 'openvidu-browser';

interface OpenViduVideoComponentProps {
  streamManager: StreamManager | null;
  muted?: boolean;
  volume?: number;
}

export default class OpenViduVideoComponent extends Component<OpenViduVideoComponentProps> {
  videoRef: React.RefObject<HTMLVideoElement>;

  constructor(props: OpenViduVideoComponentProps) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.streamManager && this.videoRef.current) {
      this.props.streamManager.addVideoElement(this.videoRef.current);
      if (this.videoRef.current) {
        this.videoRef.current.muted = this.props.muted || false;
        this.videoRef.current.volume = this.props.volume || 1;
      }
    }
  }

  componentDidUpdate(prevProps: OpenViduVideoComponentProps) {
    if (prevProps.streamManager !== this.props.streamManager && this.props.streamManager && this.videoRef.current) {
      this.props.streamManager.addVideoElement(this.videoRef.current);
    }
    if (this.videoRef.current) {
      if (prevProps.muted !== this.props.muted) {
        this.videoRef.current.muted = this.props.muted || false;
      }
      if (prevProps.volume !== this.props.volume) {
        this.videoRef.current.volume = this.props.volume || 1;
      }
    }
  }

  render() {
    return (
      <video
          style={{ height: "100%", objectFit: "cover", borderRadius: "8px", zIndex: 51 }}
          autoPlay={true}
          muted={this.props.muted}
          ref={this.videoRef}
        />

    );
  }
}
