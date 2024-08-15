package com.ssafy.kidslink.application.album.dto;

import com.ssafy.kidslink.application.child.dto.ChildDTO;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class AlbumDTO {
    int albumId;
    String albumName;
    String albumDate;
    List<ImageDTO> images;
}
