package com.ssafy.kidslink.application.noticeboard.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class NoticeBoardDTO {
    private String teacherName;
    private String title;
    private String content;
    private LocalDate createDate;

}
