package com.ssafy.kidslink.application.diary.service;

import com.ssafy.kidslink.application.child.repository.ChildRepository;
import com.ssafy.kidslink.application.diary.domain.Diary;
import com.ssafy.kidslink.application.diary.dto.DiaryDTO;
import com.ssafy.kidslink.application.diary.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DiaryService {

    private final ChildRepository childRepository;
    private final DiaryRepository diaryRepository;

    public void createDiary(int id, DiaryDTO diaryDTO){
        Diary diary = new Diary();
        diary.setDiaryDate(diaryDTO.getCreateDate());
        diary.setDiaryContents(diaryDTO.getContent());
        diary.setChild(childRepository.findById(id).get());

        diaryRepository.save(diary);

    }

}
