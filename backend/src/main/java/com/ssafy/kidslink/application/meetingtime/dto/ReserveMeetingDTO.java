package com.ssafy.kidslink.application.meetingtime.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ReserveMeetingDTO {
    private String meetingDate;
    private String meetingTime;
}
