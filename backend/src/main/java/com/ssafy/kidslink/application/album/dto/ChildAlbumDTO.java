package com.ssafy.kidslink.application.album.dto;

import com.ssafy.kidslink.application.child.dto.ChildDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class ChildAlbumDTO {
    ChildDTO child;
    List<AlbumDTO> albums;
}
