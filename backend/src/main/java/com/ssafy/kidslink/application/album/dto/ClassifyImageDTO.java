package com.ssafy.kidslink.application.album.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class ClassifyImageDTO {
    int childId;
    int count;
    List<Integer> images;
}
