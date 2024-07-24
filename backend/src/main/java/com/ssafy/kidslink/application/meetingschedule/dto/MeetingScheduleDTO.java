package com.ssafy.kidslink.application.meetingschedule.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class MeetingScheduleDTO {
    private int meetingId;
    private LocalDate meetingDate;
    private String meetingTime;
    private int parentId;
    private int teacherId;
}
