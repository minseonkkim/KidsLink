package com.ssafy.kidslink.application.schedule.dto;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class KindergartenScheduleDTO {
    private int id;
    private String Content;
    private LocalDate date;
}
