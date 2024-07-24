package com.ssafy.kidslink.application.album.service;

import com.ssafy.kidslink.application.album.dto.ReferenceImageDTO;
import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.child.repository.ChildRepository;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import com.ssafy.kidslink.application.image.service.ImageService;
import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import com.ssafy.kidslink.common.dto.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlbumService {

    private final TeacherRepository teacherRepository;
    private final ChildRepository childRepository;
    private final RestTemplate restTemplate;
    private final ImageService imageService;

    public String classifyImages(User teacher, MultipartRequest request) {
        // 분류 전 사진 데이터 가져오기
        List<MultipartFile> images = request.getFiles("images");
        log.info("images: {}", images);

        // 사진 데이터 저장 후 저장되는 DTO
        List<ImageDTO> paths = new ArrayList<>();

        // TODO #1 사진 데이터 저장
        for (MultipartFile image : images) {
            try {
                paths.add(imageService.storeFile(image));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        log.info("paths: {}", paths);

        // 기본 어린이 프로필 가져오기(존재하는 어린이 프로필만 가져오기)
        KindergartenClass kindergartenClass = teacherRepository.findByTeacherUsername(teacher.getUsername()).getKindergartenClass();
        List<Child> children = childRepository.findByKindergartenClass(kindergartenClass);
        List<ReferenceImageDTO> referenceImages = new ArrayList<>();

        List<String> profiles = new ArrayList<>();
        for (Child child : children) {
            if (child.getChildProfile() != null) {
                referenceImages.add(new ReferenceImageDTO(child.getKindergartenClass().getKindergartenClassId() + ":" + child.getChildId(), child.getChildProfile()));
            }
        }

        // TODO #2 Flask 서버 API 요청

        // Prepare the payload
        Map<String, Object> payload = new HashMap<>();
        payload.put("reference", referenceImages);
        payload.put("classify", paths);

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create the request
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

        // python server로 POST 요청
        // Send POST request to Flask server
        String url = "http://localhost:5000/classify"; // or "/find_best_match" based on your requirement
        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        log.info("response - {}", response.getBody());

        return response.getBody();
    }
}
