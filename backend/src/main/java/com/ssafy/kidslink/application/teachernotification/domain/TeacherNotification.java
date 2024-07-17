package com.ssafy.kidslink.application.teachernotification.domain;

import com.ssafy.kidslink.application.teacher.domain.Teacher;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class TeacherNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer teacherNotificationId;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    private String code;
    private String teacherNotificationText;
    private String confirmationStatus;

    // Getters and Setters
}