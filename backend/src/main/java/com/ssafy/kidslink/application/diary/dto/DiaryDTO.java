package com.ssafy.kidslink.application.diary.dto;

import com.ssafy.kidslink.application.image.domain.Image;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@ToString
public class DiaryDTO {
    private LocalDate createDate;
    private String content;
    List<Image> images;
}
