package com.ssafy.kidslink.application.album.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.kidslink.application.album.domain.Album;
import com.ssafy.kidslink.application.album.dto.*;
import com.ssafy.kidslink.application.album.mapper.AlbumMapper;
import com.ssafy.kidslink.application.album.repository.AlbumRepository;
import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.child.dto.ChildDTO;
import com.ssafy.kidslink.application.child.mapper.ChildMapper;
import com.ssafy.kidslink.application.child.repository.ChildRepository;
import com.ssafy.kidslink.application.child.service.ChildService;
import com.ssafy.kidslink.application.image.domain.Image;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import com.ssafy.kidslink.application.image.repository.ImageRepository;
import com.ssafy.kidslink.application.image.service.ImageService;
import com.ssafy.kidslink.application.kindergarten.domain.KindergartenClass;
import com.ssafy.kidslink.application.kindergarten.repository.KindergartenClassRepository;
import com.ssafy.kidslink.application.notification.domain.ParentNotification;
import com.ssafy.kidslink.application.notification.respository.ParentNotificationRepository;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import com.ssafy.kidslink.common.enums.NotificationCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@Slf4j
@Service
public class AlbumService {
    private final ImageRepository imageRepository;
    private final ChildRepository childRepository;
    private final AlbumRepository albumRepository;
    private final AlbumMapper albumMapper;
    private final ParentNotificationRepository parentNotificationRepository;
    private final KindergartenClassRepository kindergartenClassRepository;
    private final ChildMapper childMapper;
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
        log.info("reference - {}", referenceImages);
        log.info("classify - {}", classifies);

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
        Map<String, List<ImageDTO>> groupedResults = new HashMap<>();
        List<ImageDTO> unknownList = new ArrayList<>();

        for (Map<String, Object> result : responseList) {
            String bestMatchReference = (String) result.get("best_match_reference");
            int imageId = (int) result.get("classify_image_id");
            String classifyImagePath = (String) result.get("classify_image_path");
            Boolean verified = (Boolean) result.get("verified");

            ImageDTO imageDTO = new ImageDTO(imageId, classifyImagePath);

            if (!verified) {
                unknownList.add(imageDTO);
            } else {
                groupedResults.computeIfAbsent(bestMatchReference, k -> new ArrayList<>()).add(imageDTO);
            }
        }

        List<ClassifyImageDTO> classifyImageDTOs = new ArrayList<>();

        // Convert grouped results to DTOs
        for (Map.Entry<String, List<ImageDTO>> entry : groupedResults.entrySet()) {
            String[] parts = entry.getKey().split(":");
            int childId = Integer.parseInt(parts[1]);
            ChildDTO childDTO = childService.getChildInfo(childId);
            List<ImageDTO> images = entry.getValue();
            classifyImageDTOs.add(new ClassifyImageDTO(childDTO, images.size(), images));
        }

        // Add unknown group if there are any
        if (!unknownList.isEmpty()) {
            classifyImageDTOs.add(new ClassifyImageDTO(null, unknownList.size(), unknownList)); // null for unknown
        }
        return classifyImageDTOs;
    }

    public void uploadAlbum(RequestAlbumDTO requestAlbumDTO) {
        String albumName = requestAlbumDTO.getAlbumName();

        if (requestAlbumDTO.getTaggedPhotos().isEmpty()) {
            throw new RuntimeException("Tagged photos is empty");
        }

        for (ChildImageDTO taggedPhoto : requestAlbumDTO.getTaggedPhotos()) {
            if (taggedPhoto.getPhotos().isEmpty()) continue;

            Set<Image> images = taggedPhoto.getPhotos().stream()
                    .map(imageId -> imageRepository.findById(imageId)
                            .orElseThrow(() -> new RuntimeException("Image not found with id " + imageId)))
                    .collect(Collectors.toSet());

            Child child = childRepository.findById(taggedPhoto.getChildId())
                    .orElseThrow(() -> new RuntimeException("Child not found with id " + taggedPhoto.getChildId()));

            Album album = new Album();
            album.setAlbumName(albumName);
            album.setImages(images);
            album.setChild(child);

            albumRepository.save(album);

            // TODO #1 부모님에게 알림 전송하기 (요구사항 : 앨범 이름도 함께 전송)
            ParentNotification parentNotification = new ParentNotification();
            parentNotification.setCode(NotificationCode.ALBUM);
            parentNotification.setParentNotificationDate(LocalDate.now());
            parentNotification.setParent(child.getParent());
            parentNotification.setParentNotificationText(album.getAlbumName() + "앨범이 등록되었습니다.");

            parentNotificationRepository.save(parentNotification);

        }
    }

    public List<AlbumDTO> getChildAlbums(int childId) {
        Child child = childRepository.findById(childId).orElseThrow(() -> new RuntimeException("Child not found with id " + childId));
        return albumRepository.findByChild(child).stream().map(albumMapper::toDTO).collect(Collectors.toList());
    }

    public AlbumDTO getAlbumById(int albumId) {
        return albumMapper.toDTO(albumRepository.findById(albumId).orElseThrow(() -> new RuntimeException("Album not found with id " + albumId)));
    }

    public List<ChildAlbumDTO> getAllChildrenAlbums(int kindergartenClassId) {
        KindergartenClass kindergartenClass = kindergartenClassRepository.findById(kindergartenClassId).orElseThrow();
        List<Child> children = childRepository.findByKindergartenClass(kindergartenClass);
        List<ChildAlbumDTO> childAlbumDTOs = new ArrayList<>();
        for (Child child : children) {
            ChildAlbumDTO childAlbumDTO = new ChildAlbumDTO();
            childAlbumDTO.setChild(childMapper.toDTO(child));
            List<Album> albums = albumRepository.findByChild(child);
            List<AlbumDTO> albumDTOs = new ArrayList<>();
            for (Album album : albums) {
                albumDTOs.add(albumMapper.toDTO(album));
            }
            childAlbumDTO.setAlbums(albumDTOs);
            childAlbumDTOs.add(childAlbumDTO);
        }
        return childAlbumDTOs;
    }

}
