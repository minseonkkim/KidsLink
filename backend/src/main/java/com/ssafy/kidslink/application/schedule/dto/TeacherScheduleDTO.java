package com.ssafy.kidslink.application.schedule.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class TeacherScheduleDTO {
    private int id;
    private LocalDate date;
    private String content;
}
