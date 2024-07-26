package com.ssafy.kidslink.application.notification.respository;

import com.ssafy.kidslink.application.notification.domain.TeacherNotification;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeacherNotificationRepository extends JpaRepository<TeacherNotification, Long> {
    List<TeacherNotification> findByTeacher(Teacher teacher);
    @Query("SELECT COUNT(tn) FROM TeacherNotification tn WHERE tn.teacher = :teacher")
    int countByTeacher(Teacher teacher);

}
