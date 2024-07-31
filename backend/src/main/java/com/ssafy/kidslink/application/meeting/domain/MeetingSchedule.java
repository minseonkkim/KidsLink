package com.ssafy.kidslink.application.meeting.domain;

import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "meeting_schedule")
public class MeetingSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meeting_schedule_id")
    private Integer meetingScheduleId;

    @Column(name = "meeting_schedule_date")
    private LocalDate meetingScheduleDate;

    @Column(name = "meeting_schedule_time")
    private String meetingScheduleTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent;
}