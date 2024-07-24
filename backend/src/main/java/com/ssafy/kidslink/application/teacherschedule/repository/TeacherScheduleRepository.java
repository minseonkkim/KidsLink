package com.ssafy.kidslink.application.teacherschedule.repository;

import com.ssafy.kidslink.application.teacherschedule.domain.TeacherSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherScheduleRepository extends JpaRepository<TeacherSchedule, Integer> {
}
