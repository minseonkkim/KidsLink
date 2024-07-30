package com.ssafy.kidslink.application.album.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ChildImage {
    int childId;
    List<Integer> photos;
}
