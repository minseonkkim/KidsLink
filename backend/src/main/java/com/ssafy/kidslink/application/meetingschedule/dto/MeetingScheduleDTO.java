package com.ssafy.kidslink.application.meetingschedule.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MeetingScheduleDTO {
    private int meetingId;
    private String meetingDate;
    private String meetingTime;
    private int parentId;
    private int TeacherId;
}
