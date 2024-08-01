package com.ssafy.kidslink.common.controller;

import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/video")
@Slf4j
public class VideoController {
    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    /**
     * @param params The Session properties
     * @return The Session ID
     */
    @PostMapping("/sessions")
    public ResponseEntity<String> initializeSession(@RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {

        // 파라미터 수정
        if (params != null && "MEDIA_SERVER_PREFERRED".equals(params.get("forcedVideoCodec"))) {
            params.put("forcedVideoCodec", "VP8"); // 올바른 값으로 변경
        }

        SessionProperties properties = SessionProperties.fromJson(params).build();
        Session session = openvidu.createSession(properties);
        return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
    }

    /**
     * @param sessionId The Session in which to create the Connection
     * @param params    The Connection properties
     * @return The Token associated to the Connection
     */
    @PostMapping("/sessions/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId,
                                                   @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {

        log.info("Received request to create connection for session: {}", sessionId);
        log.info("Request parameters: {}", params);

        Session session = openvidu.getActiveSession(sessionId);
        if (session == null) {
            log.error("Session not found: {}", sessionId);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // JSON 요청 본문에서 특정 키가 있는지 확인하고 기본 값을 설정
        if (params == null) {
            params = new HashMap<>();
        }
        params.putIfAbsent("role", "PUBLISHER");
        params.putIfAbsent("data", "Some data");
        params.putIfAbsent("type", "WEBRTC");
        params.putIfAbsent("kurentoOptions", new HashMap<>());
        params.putIfAbsent("customIceServers", new ArrayList<>());
        params.putIfAbsent("rtspUri", "");
        params.putIfAbsent("adaptativeBitrate", false);
        params.putIfAbsent("onlyPlayWithSubscribers", false);
        params.putIfAbsent("networkCache", 0);

        log.info("Final connection properties: {}", params);

        try {


            ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
            log.info("Built ConnectionProperties: {}", properties);

            Connection connection = session.createConnection(properties);
            log.info("Connection created: {}", connection.getToken());
            return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            log.error("OpenVidu exception: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("Unexpected error: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    /**
     * Start recording a session
     * @param sessionId The Session ID
     * @return The Recording ID
     */
    @PostMapping("/sessions/{sessionId}/recordings/start")
    public ResponseEntity<String> startRecording(@PathVariable("sessionId") String sessionId)
            throws OpenViduJavaClientException, OpenViduHttpException {
        System.out.println("녹화시작");
        RecordingProperties properties = new RecordingProperties.Builder()
                .outputMode(Recording.OutputMode.COMPOSED)
                .build();
        Recording recording = openvidu.startRecording(sessionId, properties);
        return new ResponseEntity<>(recording.getId(), HttpStatus.OK);
    }

    /**
     * Stop recording a session
     * @param recordingId The Recording ID
     * @return The stopped Recording
     */
    @PostMapping("/recordings/stop/{recordingId}")
    public ResponseEntity<Recording> stopRecording(@PathVariable("recordingId") String recordingId)
            throws OpenViduJavaClientException, OpenViduHttpException {
        System.out.println("녹화중지");
        Recording recording = openvidu.stopRecording(recordingId);
        return new ResponseEntity<>(recording, HttpStatus.OK);
    }



    /**
     * Get a list of all recordings
     * @return The list of recordings
     */
    @GetMapping("/recordings")
    public ResponseEntity<List<Recording>> listRecordings() throws OpenViduJavaClientException, OpenViduHttpException {
        List<Recording> recordings = openvidu.listRecordings();
        return new ResponseEntity<>(recordings, HttpStatus.OK);
    }

    /**
     * Get a specific recording by ID
     * @param recordingId The Recording ID
     * @return The Recording
     */
    @GetMapping("/recordings/{recordingId}")
    public ResponseEntity<Recording> getRecording(@PathVariable("recordingId") String recordingId)
            throws OpenViduJavaClientException, OpenViduHttpException {
        Recording recording = openvidu.getRecording(recordingId);
        return new ResponseEntity<>(recording, HttpStatus.OK);
    }


}
