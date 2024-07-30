package com.ssafy.kidslink.application.meetingtime.domain;

import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "selected_meeting")
public class SelectedMeeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "selected_meeting_id")
    private Integer selectedMeetingId;

    @Column(name = "selected_meeting_date")
    private LocalDate selectedMeetingDate;

    @Column(name = "selected_meeting_time")
    private String selectedMeetingTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent;
}
