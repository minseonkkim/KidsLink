package com.ssafy.kidslink.application.album.dto;

import com.ssafy.kidslink.application.child.dto.ChildDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class ClassifyImageDTO {
    ChildDTO child;
    int count;
    List<String> images;
}
