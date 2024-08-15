package com.ssafy.kidslink.application.meeting.domain;

import com.ssafy.kidslink.application.teacher.domain.Teacher;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "meeting_time")
public class MeetingTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meeting_time_id")
    private Integer meetingTimeId;

    @Column(name = "meeting_time")
    private String meetingTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @Column(name = "meeting_date")
    private LocalDate meetingDate;
}