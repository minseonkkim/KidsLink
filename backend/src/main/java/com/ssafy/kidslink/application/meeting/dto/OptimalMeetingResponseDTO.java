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
    LocalDate date; // 2024-08-19
    LocalTime time; // 09:28
}
/*
{
parentId
date
time
}

 */
