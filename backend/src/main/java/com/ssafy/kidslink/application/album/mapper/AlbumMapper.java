package com.ssafy.kidslink.application.album.mapper;

import com.ssafy.kidslink.application.album.domain.Album;
import com.ssafy.kidslink.application.album.dto.AlbumDTO;
import com.ssafy.kidslink.application.image.domain.Image;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import com.ssafy.kidslink.application.image.mapper.ImageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AlbumMapper {
    private final ImageMapper imageMapper;

    public AlbumDTO toDTO(Album album) {
        AlbumDTO albumDTO = new AlbumDTO();
        albumDTO.setAlbumId(album.getAlbumId());
        albumDTO.setAlbumDate(album.getAlbumDate());
        albumDTO.setAlbumName(album.getAlbumName());
        List<ImageDTO> images = new ArrayList<>();
        for (Image image : album.getImages()) {
            images.add(imageMapper.toDTO(image));
        }
        albumDTO.setImages(images);
        return albumDTO;
    }
}
