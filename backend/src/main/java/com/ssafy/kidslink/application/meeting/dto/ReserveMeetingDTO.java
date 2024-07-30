package com.ssafy.kidslink.application.meetingtime.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class ReserveMeetingDTO {
    private LocalDate meetingDate;
    private String meetingTime;
}
