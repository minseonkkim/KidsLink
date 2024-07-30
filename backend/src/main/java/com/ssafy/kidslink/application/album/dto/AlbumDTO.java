package com.ssafy.kidslink.application.album.dto;

import com.ssafy.kidslink.application.child.dto.ChildDTO;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@ToString
public class AlbumDTO {
    int albumId;
    String albumName;
    LocalDate albumDate;
    ChildDTO child;
    List<ImageDTO> images;
}
