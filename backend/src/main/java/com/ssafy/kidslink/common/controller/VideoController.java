package com.ssafy.kidslink.common.controller;

import com.ssafy.kidslink.common.service.VideoService;
import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/video")
@Slf4j
public class VideoController {
    private final VideoService videoService;

    /**
     * @param params The Session properties
     * @return The Session ID
     */
    @PostMapping("/sessions")
    public ResponseEntity<String> initializeSession(@RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        String sessionId = videoService.createSession(params);
        return new ResponseEntity<>(sessionId, HttpStatus.OK);
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
        String token = videoService.createConnection(sessionId, params);
        return new ResponseEntity<>(token, HttpStatus.OK);
    }


    /**
     * Start recording a session
     *
     * @param sessionId The Session ID
     * @return The Recording ID
     */
    @PostMapping("/sessions/{sessionId}/recordings/start")
    public ResponseEntity<Map<String, Object>> startRecording(@PathVariable("sessionId") String sessionId)
            throws OpenViduJavaClientException, OpenViduHttpException {
        Map<String, Object> response = videoService.startRecording(sessionId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Stop recording a session
     * @param recordingId The Recording ID
     * @return The stopped Recording
     */
    @PostMapping("/recordings/stop/{recordingId}")
    public ResponseEntity<Map<String, Object>> stopRecording(@PathVariable("recordingId") String recordingId,
                                                             @RequestBody Map<String, Long> body)
            throws OpenViduJavaClientException, OpenViduHttpException {
        Long startTime = body.get("startTime");
        Map<String, Object> response = videoService.stopRecording(recordingId, startTime);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }



    /**
     * Get a list of all recordings
     * @return The list of recordings
     */
    @GetMapping("/recordings")
    public ResponseEntity<List<Recording>> listRecordings()
            throws OpenViduJavaClientException, OpenViduHttpException {
        List<Recording> recordings = videoService.listRecordings();
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
        Recording recording = videoService.getRecording(recordingId);
        return new ResponseEntity<>(recording, HttpStatus.OK);
    }


    /**
     * Download a recording by ID
     * @param sessionId The Recording ID
     * @return The Recording file
     */
    @GetMapping("/recordings/download/{sessionId}/recording/{recordingName}")
    public ResponseEntity<FileSystemResource> downloadRecording(@PathVariable("sessionId") String sessionId,
                                                                @PathVariable("recordingName") String recordingName) {
        File file = videoService.getRecordingFile(sessionId, recordingName);
        if (!file.exists()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        FileSystemResource resource = new FileSystemResource(file);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"");
        headers.add(HttpHeaders.CONTENT_TYPE, "video/mp4");
        headers.add(HttpHeaders.CONTENT_LENGTH, String.valueOf(file.length()));
        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
    }

}
