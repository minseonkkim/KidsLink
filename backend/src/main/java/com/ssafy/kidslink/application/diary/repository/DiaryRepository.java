package com.ssafy.kidslink.application.diary.repository;

import com.ssafy.kidslink.application.diary.domain.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Integer> {
    List<Diary> findByChildChildId(Integer childId);
}
