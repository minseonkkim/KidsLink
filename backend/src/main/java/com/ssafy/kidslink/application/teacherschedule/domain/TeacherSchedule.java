package com.ssafy.kidslink.application.teacherschedule.domain;

import com.ssafy.kidslink.application.teacher.domain.Teacher;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "teacher_schedule")
public class TeacherSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "teacher_schedule_id")
    private Integer teacherScheduleId;

    @Column(name = "teacher_schedule_date")
    private LocalDate teacherScheduleDate;

    @Column(name = "teacher_schedule_contents")
    private String teacherScheduleContents;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;
}