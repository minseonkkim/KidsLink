package com.ssafy.kidslink.application.album.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class RequestAlbumDTO {
    private String albumName;
    private List<ChildImageDTO> taggedPhotos;
}


