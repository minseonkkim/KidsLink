package com.ssafy.kidslink.application.schedule.repository;

import com.ssafy.kidslink.application.schedule.domain.TeacherSchedule;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TeacherScheduleRepository extends JpaRepository<TeacherSchedule, Integer> {
    List<TeacherSchedule> findByTeacherAndTeacherScheduleDate(Teacher teacher, LocalDate date);
}
