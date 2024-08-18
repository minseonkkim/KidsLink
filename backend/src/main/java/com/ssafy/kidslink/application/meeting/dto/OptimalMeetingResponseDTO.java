package com.ssafy.kidslink.application.meeting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@AllArgsConstructor
@Getter
public class OptimalMeetingResponseDTO {
    int parentId;
    LocalDate date;
    LocalTime time;
}
