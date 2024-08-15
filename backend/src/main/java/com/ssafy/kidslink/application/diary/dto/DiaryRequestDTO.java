package com.ssafy.kidslink.application.diary.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
public class DiaryRequestDTO {
    private List<MultipartFile> files;
    private String content;
    private String diaryDate;
}
