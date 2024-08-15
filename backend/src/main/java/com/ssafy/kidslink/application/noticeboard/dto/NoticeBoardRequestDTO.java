package com.ssafy.kidslink.application.noticeboard.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class NoticeBoardRequestDTO {
    private String title;
    private String content;
}
