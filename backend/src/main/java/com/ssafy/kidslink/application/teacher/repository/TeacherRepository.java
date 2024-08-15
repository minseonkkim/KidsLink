package com.ssafy.kidslink.application.teacher.repository;

import com.ssafy.kidslink.application.kindergarten.domain.KindergartenClass;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<Teacher, Integer> {
    boolean existsByTeacherUsername(String username);
    Teacher findByTeacherUsername(String username);
    Teacher findByKindergartenClass(KindergartenClass kindergartenClass);
}
