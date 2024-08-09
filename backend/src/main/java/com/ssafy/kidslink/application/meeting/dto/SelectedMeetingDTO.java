package com.ssafy.kidslink.application.meeting.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class SelectedMeetingDTO {
    private LocalDate date;
    private String time;
    private int teacherId;
    private String teacherName;
    private String parentUsername;
    private String childName;
}