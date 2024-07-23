package com.ssafy.kidslink.application.album.service;

import com.ssafy.kidslink.application.album.dto.ClassifyImageDTO;
import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.child.repository.ChildRepository;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import com.ssafy.kidslink.common.dto.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlbumService {

    private final TeacherRepository teacherRepository;
    private final ChildRepository childRepository;
    private final RestTemplate restTemplate;

    public ClassifyImageDTO classifyImages(User teacher, List<ImageDTO> paths) {
        KindergartenClass kindergartenClass = teacherRepository.findByTeacherUsername("kimteacher").getKindergartenClass();
        List<Child> children = childRepository.findByKindergartenClassKindergartenClassIdAndKindergartenClassKindergartenId(kindergartenClass.getKindergartenId(), kindergartenClass.getKindergartenClassId());

        List<String> childImages = children.stream().map(Child::getChildProfile)
                .collect(Collectors.toList());

        // Prepare the payload
        Map<String, Object> payload = new HashMap<>();
        payload.put("childImages", childImages);
        payload.put("paths", paths);

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create the request
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

        // python server로 POST 요청
        // Send POST request to Flask server
        String url = "http://localhost:5000/analyze"; // or "/find_best_match" based on your requirement
        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        log.info("response - {}", response.getBody().toString());

        return null;
    }
}
