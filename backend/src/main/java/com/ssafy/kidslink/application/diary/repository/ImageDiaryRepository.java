package com.ssafy.kidslink.application.diary.repository;

import com.ssafy.kidslink.application.diary.domain.Diary;
import com.ssafy.kidslink.application.diary.domain.ImageDiary;
import com.ssafy.kidslink.application.diary.domain.ImageDiaryId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageDiaryRepository extends JpaRepository<ImageDiary, ImageDiaryId> {
    List<ImageDiary> findByDiary(Diary diary);
}
