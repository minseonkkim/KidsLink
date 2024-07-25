package com.ssafy.kidslink.application.diary.service;

import com.ssafy.kidslink.application.child.repository.ChildRepository;
import com.ssafy.kidslink.application.diary.domain.Diary;
import com.ssafy.kidslink.application.diary.dto.DiaryRequestDTO;
import com.ssafy.kidslink.application.diary.repository.DiaryRepository;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import com.ssafy.kidslink.application.image.service.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DiaryService {

    private final ChildRepository childRepository;
    private final DiaryRepository diaryRepository;
    private final ImageService imageService;

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
        if (images.size() > 0) {
            diary.setDiaryThumbnail(images.get(0).getPath());
        }
        diary.setDiaryContents(request.getContent());
        diary.setDiaryDate(LocalDate.parse(request.getDiaryDate()));
        diary.setChild(childRepository.findById(childId).orElseThrow());
        diaryRepository.save(diary);
    }
}
