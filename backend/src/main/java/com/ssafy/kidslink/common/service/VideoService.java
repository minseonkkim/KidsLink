package com.ssafy.kidslink.common.service;

import io.openvidu.java.client.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class VideoService {
    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String OPENVIDU_SECRET;

    @Value("${openvidu.recording.path}")
    private String recordingPath;

    private final OpenVidu openvidu;

    public String createSession(Map<String, Object> params) throws OpenViduJavaClientException, OpenViduHttpException {
        // 파라미터 수정
        if (params != null && "MEDIA_SERVER_PREFERRED".equals(params.get("forcedVideoCodec"))) {
            params.put("forcedVideoCodec", "VP8"); // 올바른 값으로 변경
        }

        SessionProperties properties = SessionProperties.fromJson(params).build();
        Session session = openvidu.createSession(properties);
        return session.getSessionId();
    }

    public String createConnection(String sessionId, Map<String, Object> params) throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openvidu.getActiveSession(sessionId);
        if (session == null) {
//            throw new OpenViduHttpException(HttpStatus.NOT_FOUND.value());
            throw new RuntimeException("Session not found");
        }
        log.info("Modified params: {}", params);
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        log.info("OPENVIDU_URL: {}", OPENVIDU_URL);
        Connection connection = session.createConnection(properties);
        log.info("connection: {}", connection);
        return connection.getToken();
    }

    public Map<String, Object> startRecording(String sessionId) throws OpenViduJavaClientException, OpenViduHttpException {
        log.info("녹화시작 startRecording");
        String recordingName = sessionId + "_" + System.currentTimeMillis();
        RecordingProperties properties = new RecordingProperties.Builder()
                .name(recordingName)
                .outputMode(Recording.OutputMode.COMPOSED)
                .hasAudio(true)
                .hasVideo(true)
                .build();
        Recording recording = this.openvidu.startRecording(sessionId, properties);

        Map<String, Object> response = new HashMap<>();
        response.put("recordingId", recording.getId());
        response.put("recordingName", recordingName);
        response.put("recording", recording);
        response.put("recordingPath", recordingPath);
        return response;
    }

    public Map<String, Object> stopRecording(String recordingId, Long startTime) throws OpenViduJavaClientException, OpenViduHttpException {
        log.info("녹화중지");
        // TODO: FFmpeg 등을 사용하여 startTime부터 끝까지 자르기 처리 로직 추가
        // 예: trimRecording(recording.getId(), startTime);

        Recording recording = openvidu.stopRecording(recordingId);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("recordingId", recordingId);
        response.put("recording", recording);
        return response;
    }

    public List<Recording> listRecordings() throws OpenViduJavaClientException, OpenViduHttpException {
        return openvidu.listRecordings();
    }

    public Recording getRecording(String recordingId) throws OpenViduJavaClientException, OpenViduHttpException {
        return openvidu.getRecording(recordingId);
    }

    public File getRecordingFile(String sessionId, String recordingName) {
        return new File(recordingPath + "/" + sessionId + "/" + recordingName + ".mp4");
    }

    // TODO: startTime부터 녹화본을 자르는 로직을 추가할 수 있습니다.
    // private void trimRecording(String recordingId, Long startTime) {
    //     // FFmpeg를 사용하여 영상 자르기 로직 구현
    // }
}
