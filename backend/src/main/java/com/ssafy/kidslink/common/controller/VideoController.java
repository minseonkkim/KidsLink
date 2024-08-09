package com.ssafy.kidslink.common.controller;

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
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @Value("${openvidu.recording.path}")
    private String recordingPath;

    private OpenVidu openvidu;

    private List<String> segmentList = new ArrayList<>();

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
        Session session = openvidu.getActiveSession(sessionId);
        if (session == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        log.info("Modified params: {}", params);
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        log.info("OPENVIDU_URL: {}", OPENVIDU_URL);
        Connection connection = session.createConnection(properties);
        log.info("connection: {}", connection);
        return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
    }



    /**
     * Start recording a session
     * @param sessionId The Session ID
     * @return The Recording ID
     */
    @PostMapping("/sessions/{sessionId}/recordings/start")
    public ResponseEntity<String> startRecording(@PathVariable("sessionId") String sessionId) throws OpenViduJavaClientException, OpenViduHttpException {
        System.out.println("녹화시작");
        // 현재 날짜를 "yyyyMMdd" 형식으로 포맷팅
        String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        // 세션 ID와 날짜를 사용하여 녹화 파일명 생성
        String recordingName = sessionId + "_" + currentDate;

        RecordingProperties properties = new RecordingProperties.Builder()
                .name(recordingName)
                .outputMode(Recording.OutputMode.COMPOSED)
                .hasAudio(true)
                .hasVideo(true)
                .build();

        Recording recording = this.openvidu.startRecording(sessionId, properties);
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

    @PostMapping("/recordings/save")
    public ResponseEntity<String> saveSegments(@RequestBody List<String> segmentList) {
        try {
            String sessionId = segmentList.get(0).split("_")[0];  // 예시로 세션 ID를 추출
            String segmentDirectoryPath = "/path/to/recordings/" + sessionId;
            String mergedFilePath = "/path/to/recordings/" + sessionId + "/merged_output.mp4";

            mergeSegmentsToMP4(segmentList, segmentDirectoryPath, mergedFilePath);

            return new ResponseEntity<>(mergedFilePath, HttpStatus.OK);
        } catch (IOException | InterruptedException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void mergeSegmentsToMP4(List<String> segmentList, String segmentDirectoryPath, String mergedFilePath) throws IOException, InterruptedException {
        // segments.txt 파일 생성
        String fileListPath = createFileList(segmentList, segmentDirectoryPath);

        // FFmpeg 명령어 실행
        ProcessBuilder pb = new ProcessBuilder("ffmpeg", "-f", "concat", "-safe", "0", "-i", fileListPath, "-c", "copy", mergedFilePath);
        pb.redirectErrorStream(true);
        Process process = pb.start();
        process.waitFor();
    }

    private String createFileList(List<String> segmentList, String segmentDirectoryPath) throws IOException {
        String fileListPath = segmentDirectoryPath + "/segments.txt";
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(fileListPath))) {
            for (String segment : segmentList) {
                writer.write("file '" + segmentDirectoryPath + "/" + segment + ".mp4'\n");
            }
        }
        return fileListPath;
    }

    /**
     * Get a list of all recordings
     * @return The list of recordings
     */
    @GetMapping("/recordings")
    public ResponseEntity<List<Recording>> listRecordings() throws OpenViduJavaClientException, OpenViduHttpException {
        List<Recording> recordings = openvidu.listRecordings();
        log.info("Recordings: {}", recordings);
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


    /**
     * Download a recording by ID
     * @param sessionId The Recording ID
     * @return The Recording file
     */
    @GetMapping("/recordings/download/{sessionId}/recording/{recordingName}")
    public ResponseEntity<FileSystemResource> downloadRecording(@PathVariable("sessionId") String sessionId, @PathVariable("recordingName") String recordingName) {
        // TODO #1 아래 코드 참고해서 recordingId가 정확하게 경로를 가리키는지 확인해보기
        File file = new File(recordingPath + "/" + sessionId + "/" + recordingName + ".mp4");
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
