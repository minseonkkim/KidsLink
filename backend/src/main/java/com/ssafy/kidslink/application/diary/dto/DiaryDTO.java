package com.ssafy.kidslink.application.diary.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class DiaryDTO {
    private LocalDate createDate;
    private String content;
}
