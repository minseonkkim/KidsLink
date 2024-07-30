package com.ssafy.kidslink.application.diary.service;

import com.ssafy.kidslink.application.child.repository.ChildRepository;
import com.ssafy.kidslink.application.diary.domain.Diary;
import com.ssafy.kidslink.application.diary.domain.ImageDiary;
import com.ssafy.kidslink.application.diary.dto.DiaryDTO;
import com.ssafy.kidslink.application.diary.dto.DiaryRequestDTO;
import com.ssafy.kidslink.application.diary.repository.DiaryRepository;
import com.ssafy.kidslink.application.diary.repository.ImageDiaryRepository;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import com.ssafy.kidslink.application.image.mapper.ImageMapper;

import com.ssafy.kidslink.application.image.service.ImageService;
import com.ssafy.kidslink.application.notification.domain.ParentNotification;
import com.ssafy.kidslink.application.notification.respository.ParentNotificationRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import com.ssafy.kidslink.common.enums.NotificationCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DiaryService {

    private final ChildRepository childRepository;
    private final DiaryRepository diaryRepository;
    private final ParentRepository parentRepository;
    private final ParentNotificationRepository parentNotificationRepository;

    private final ImageService imageService;
    private final ImageDiaryRepository imageDiaryRepository;
    private final ImageMapper imageMapper;
    private final TeacherRepository teacherRepository;

    public void createDiary(int childId, String teacherUsername, DiaryRequestDTO request) {
        Diary diary = new Diary();

        List<MultipartFile> files = request.getFiles();
        List<ImageDTO> images = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                images.add(imageService.storeFile(file));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        diary.setDiaryContents(request.getContent());
        diary.setDiaryDate(LocalDate.parse(request.getDiaryDate()));
        diary.setChild(childRepository.findById(childId).orElseThrow());
        Diary savedDiary = diaryRepository.save(diary);

        if (!images.isEmpty()) {
            diary.setDiaryThumbnail(images.get(0).getPath());
            for (ImageDTO image : images) {
                ImageDiary imageDiary = new ImageDiary();
                imageDiary.setDiary(savedDiary);
                imageDiary.setImage(imageService.getImageById(image.getImageId()));

                imageDiaryRepository.save(imageDiary);
            }
        }

        Teacher teacher = teacherRepository.findByTeacherUsername(teacherUsername);
        for(Parent parent : parentRepository.findByKindergartenClassId(teacher.getKindergartenClass().getKindergartenClassId())) {
            ParentNotification parentNotification = new ParentNotification();
            parentNotification.setCode(NotificationCode.NOTICE);
            parentNotification.setParentNotificationDate(LocalDate.now());
            parentNotification.setParentNotificationText("새로운 성장일지가 등록되었습니다.");
            parentNotification.setParent(parent);

            parentNotificationRepository.save(parentNotification);
        }
    }

    public List<DiaryDTO> getAllDiary(int childId) {
        List<Diary> diaries = diaryRepository.findByChildChildId(childId);
        List<DiaryDTO> diaryDTOs = new ArrayList<>();
        for (Diary diary : diaries) {
            DiaryDTO diaryDTO = new DiaryDTO();
            diaryDTO.setDiaryId(diary.getDiaryId());
            diaryDTO.setCreateDate(diary.getDiaryDate());
            diaryDTO.setContent(diary.getDiaryContents());
            diaryDTO.setTeacherName(teacherRepository.findByKindergartenClass(diary.getChild().getKindergartenClass()).getTeacherUsername());
            diaryDTO.setImages(diary.getImages().stream().map(image -> {
                ImageDTO imageDTO = new ImageDTO();
                imageDTO.setImageId(image.getImageId());
//                imageDTO.setPath(ImageService.getUriString(image.getSaveFile()));
                return imageDTO;
            }).collect(Collectors.toSet()));
            diaryDTOs.add(diaryDTO);
        }
        return diaryDTOs;
    }

    public DiaryDTO getDiary(int diaryId) {
        return diaryRepository.findById(diaryId).map(diary -> {
            DiaryDTO diaryDTO = new DiaryDTO();
            diaryDTO.setDiaryId(diary.getDiaryId());
            diaryDTO.setCreateDate(diary.getDiaryDate());
            diaryDTO.setContent(diary.getDiaryContents());
            diaryDTO.setTeacherName(teacherRepository.findByKindergartenClass(diary.getChild().getKindergartenClass()).getTeacherUsername());
            diaryDTO.setImages(diary.getImages().stream().map(imageMapper::toDTO).collect(Collectors.toSet()));
            return diaryDTO;
        }).orElseThrow();
    }

}
