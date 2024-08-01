package com.ssafy.kidslink.application.diary.mapper;

import com.ssafy.kidslink.application.diary.domain.Diary;
import com.ssafy.kidslink.application.diary.dto.DiaryDTO;
import com.ssafy.kidslink.application.image.mapper.ImageMapper;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class DiaryMapper {

    private final TeacherRepository teacherRepository;
    private final ImageMapper imageMapper;

    public DiaryMapper(TeacherRepository teacherRepository, ImageMapper imageMapper) {
        this.teacherRepository = teacherRepository;
        this.imageMapper = imageMapper;
    }

    public DiaryDTO toDTO(Diary diary) {
        DiaryDTO diaryDTO = new DiaryDTO();
        diaryDTO.setDiaryId(diary.getDiaryId());
        diaryDTO.setCreateDate(diary.getDiaryDate());
        diaryDTO.setContent(diary.getDiaryContents());
        diaryDTO.setTeacherName(teacherRepository.findByKindergartenClass(diary.getChild().getKindergartenClass()).getTeacherUsername());
        diaryDTO.setImages(diary.getImages().stream().map(imageMapper::toDTO)
                .collect(Collectors.toSet()));
        diaryDTO.setThumbnail(diary.getDiaryThumbnail());
        return diaryDTO;
    }
}
