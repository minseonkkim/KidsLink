package com.ssafy.kidslink.application.teacher.repository;

import com.ssafy.kidslink.application.teacher.domain.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<Teacher, Integer> {
}
