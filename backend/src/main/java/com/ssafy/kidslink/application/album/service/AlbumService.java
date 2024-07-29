package com.ssafy.kidslink.application.album.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.kidslink.application.album.dto.ClassifyImageDTO;
import com.ssafy.kidslink.application.album.dto.ReferenceImageDTO;
import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.child.dto.ChildDTO;
import com.ssafy.kidslink.application.child.service.ChildService;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import com.ssafy.kidslink.application.image.service.ImageService;
import com.ssafy.kidslink.application.kindergarten.domain.KindergartenClass;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
    @Value("${ai.server.url}")
    private String aiServerUrl;

    private final TeacherRepository teacherRepository;
    private final RestTemplate restTemplate;
    private final ImageService imageService;
    private final ChildService childService;

    public List<ClassifyImageDTO> classifyImages(String teacherUsername, MultipartRequest request) {
        Teacher teacher = teacherRepository.findByTeacherUsername(teacherUsername);
        List<MultipartFile> classifyImages = request.getFiles("classifyImages");

        // 사진 데이터 저장 후 저장되는 DTO
        List<ImageDTO> classifies = new ArrayList<>();

        // TODO #1 사진 데이터 저장
        for (MultipartFile image : classifyImages) {
            try {
                classifies.add(imageService.storeFile(image));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        // 기본 어린이 프로필 가져오기(존재하는 어린이 프로필만 가져오기)
        KindergartenClass kindergartenClass = teacher.getKindergartenClass();
        List<Child> children = childService.findChildrenByKindergartenClass(kindergartenClass);
        List<ReferenceImageDTO> referenceImages = new ArrayList<>();

        for (Child child : children) {
            if (child.getChildProfile() != null) {
                referenceImages.add(new ReferenceImageDTO(kindergartenClass.getKindergartenClassId() + ":" + child.getChildId(), child.getChildProfile()));
            }
        }

        // TODO #2 Flask 서버 API 요청

        // Prepare the payload
        Map<String, Object> payload = new HashMap<>();
        payload.put("reference", referenceImages);
        payload.put("classify", classifies);

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create the request
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

        // python server로 POST 요청
        // Send POST request to Flask server
        String url = aiServerUrl + "/classify";
        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        // Parse the response and transform to the desired DTO
        ObjectMapper objectMapper = new ObjectMapper();
        List<Map<String, Object>> responseList;
        try {
            responseList = objectMapper.readValue(response.getBody(), new TypeReference<List<Map<String, Object>>>() {
            });
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        // Grouping results
        Map<String, List<String>> groupedResults = new HashMap<>();
        List<String> unknownList = new ArrayList<>();

        for (Map<String, Object> result : responseList) {
            String bestMatchReference = (String) result.get("best_match_reference");
            String classifyImageId = (String) result.get("classify_image_path");
            Boolean verified = (Boolean) result.get("verified");

            if (!verified) {
                unknownList.add(classifyImageId);
            } else {
                groupedResults.computeIfAbsent(bestMatchReference, k -> new ArrayList<>()).add(classifyImageId);
            }
        }

        List<ClassifyImageDTO> classifyImageDTOs = new ArrayList<>();

        // Convert grouped results to DTOs
        for (Map.Entry<String, List<String>> entry : groupedResults.entrySet()) {
            String[] parts = entry.getKey().split(":");
            int childId = Integer.parseInt(parts[1]);
            ChildDTO childDTO = childService.getChildInfo(childId);
            List<String> images = entry.getValue();
            classifyImageDTOs.add(new ClassifyImageDTO(childDTO, images.size(), images));
        }

        // Add unknown group if there are any
        if (!unknownList.isEmpty()) {
            classifyImageDTOs.add(new ClassifyImageDTO(null, unknownList.size(), unknownList)); // -1 or any other identifier for unknown
        }
        return classifyImageDTOs;
    }
}
