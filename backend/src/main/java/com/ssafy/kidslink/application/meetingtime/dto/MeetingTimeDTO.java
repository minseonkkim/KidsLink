package com.ssafy.kidslink.application.meetingtime.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MeetingTimeDTO {
    private int meetingId;
    private String date;
    private String time;
}
