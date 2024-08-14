package com.ssafy.kidslink.common.service;

import com.ssafy.kidslink.application.kindergarten.domain.Kindergarten;
import com.ssafy.kidslink.application.meeting.domain.MeetingSchedule;
import com.ssafy.kidslink.application.meeting.repository.MeetingScheduleRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class VideoService {
    private final MeetingScheduleRepository meetingScheduleRepository;
    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String OPENVIDU_SECRET;

    @Value("${openvidu.recording.path}")
    private String recordingPath;

    private OpenVidu openvidu;
    private final TeacherRepository teacherRepository;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }


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
        MeetingSchedule meetingSchedule = meetingScheduleRepository.findById(Integer.parseInt(sessionId)).orElseThrow();
        Parent parent = meetingSchedule.getParent();
        Teacher teacher = meetingSchedule.getTeacher();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String formattedDate = LocalDateTime.now().format(formatter);
        String recordingName = sessionId + "-" + teacher.getTeacherId() + "-" + parent.getParentId() + "-" + formattedDate;
        log.info("recordingName - {}, sessionId - {}", recordingName, sessionId);
        RecordingProperties properties = new RecordingProperties.Builder()
                .name(recordingName)
                .outputMode(Recording.OutputMode.INDIVIDUAL)
                .recordingLayout(RecordingLayout.BEST_FIT)
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
        log.info("녹화 중지 시작 - 녹화 ID: {}", recordingId);
        Map<String, Object> response = new HashMap<>();

        // 녹화를 중지하여 영상을 저장합니다.
        Recording recording = openvidu.stopRecording(recordingId);
        String folderPath = recordingPath + "/" + recordingId;
        File recordingFolder = new File(folderPath);

        if (startTime == null || startTime < 0) {
            // 폴더 삭제
            if (deleteDirectory(recordingFolder)) {
                log.info("녹화된 폴더 삭제 성공: {}", folderPath);
                response.put("status", "NOT_SAVED");
            } else {
                log.error("녹화된 폴더 삭제 실패: {}", folderPath);
                throw new RuntimeException("Failed to delete recorded folder.");
            }
        } else {
            // 영상을 자르기 위해 FFmpeg를 사용합니다.
            String inputFilePath = recordingPath + "/" + recordingId + "/" + recording.getName() + ".mp4";
            String tempFilePath = recordingPath + "/" + recordingId + "/" + recording.getName() + "_trimmed.mp4";

            log.info("녹화된 파일 경로: {}", inputFilePath);
            log.info("잘라낸 파일 경로: {}", tempFilePath);

            // FFmpeg를 사용하여 영상 트리밍
            trimRecording(inputFilePath, tempFilePath, startTime);

            // 원본 파일 삭제 후 임시 파일을 원본 파일 이름으로 변경
            File originalFile = new File(inputFilePath);
            File tempFile = new File(tempFilePath);

            if (originalFile.delete()) {
                log.info("원본 파일 삭제 성공: {}", inputFilePath);
                if (tempFile.renameTo(originalFile)) {
                    log.info("임시 파일을 원본 파일 이름으로 변경 성공: {}", inputFilePath);
                } else {
                    log.error("임시 파일을 원본 파일 이름으로 변경 실패: {}", tempFilePath);
                    throw new RuntimeException("Failed to rename temp file to original file name.");
                }
            } else {
                log.error("원본 파일 삭제 실패: {}", inputFilePath);
                throw new RuntimeException("Failed to delete original file.");
            }
            response.put("status", "OK");
            response.put("inputFilePath", inputFilePath);
            response.put("outputFilePath", tempFilePath);
        }
        response.put("recordingId", recordingId);
        response.put("recordingName", recording.getName());
        response.put("recording", recording);
        return response;
    }

    private void trimRecording(String inputFilePath, String outputFilePath, Long startTime) {
        long startTimeInSeconds = startTime / 1000;

        log.info("startTimeInSeconds - {}", startTimeInSeconds);

        String startTimeFormatted = String.format("%02d:%02d:%02d",
                startTimeInSeconds / 3600,
                (startTimeInSeconds % 3600) / 60,
                startTimeInSeconds % 60
        );
        log.info("startTimeFormatted - {}", startTimeFormatted);
        ProcessBuilder pb = new ProcessBuilder("ffmpeg", "-i", inputFilePath, "-ss", startTimeFormatted, "-c", "copy", outputFilePath);
        pb.redirectErrorStream(true);

        try {
            Process process = pb.start();

            // 프로세스의 출력을 읽기 위한 BufferedReader 추가
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.info(line); // FFmpeg 명령어 출력을 로그에 기록
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                log.error("FFmpeg process failed with exit code: {}", exitCode);
            } else {
                log.info("Successfully trimmed video from {}", startTimeFormatted);
            }
        } catch (IOException | InterruptedException e) {
            log.error("Failed to trim video", e);
        }
    }

    public List<Recording> listRecordings() throws OpenViduJavaClientException, OpenViduHttpException {
        return openvidu.listRecordings();
    }

    public List<Recording> getRecordingsByTeacherId(int teacherId) throws OpenViduJavaClientException, OpenViduHttpException {
        List<Recording> recordings = listRecordings();

        return recordings.stream()
                .filter(recording -> {
                    String recordingName = recording.getName();
                    return Integer.parseInt(recordingName.split("-")[1]) == teacherId;
                })
                .collect(Collectors.toList());
    }

    public Recording getRecording(String recordingId) throws OpenViduJavaClientException, OpenViduHttpException {
        return openvidu.getRecording(recordingId);
    }

    public File getRecordingFile(String sessionId, String recordingName) {
        return new File(recordingPath + "/" + sessionId + "/" + recordingName + ".mp4");
    }

    // 디렉토리 및 내부 파일 삭제 메서드
    private boolean deleteDirectory(File directoryToBeDeleted) {
        File[] allContents = directoryToBeDeleted.listFiles();
        if (allContents != null) {
            for (File file : allContents) {
                deleteDirectory(file);
            }
        }
        return directoryToBeDeleted.delete();
    }

    // TODO: startTime부터 녹화본을 자르는 로직을 추가할 수 있습니다.
    // private void trimRecording(String recordingId, Long startTime) {
    //     // FFmpeg를 사용하여 영상 자르기 로직 구현
    // }
}
