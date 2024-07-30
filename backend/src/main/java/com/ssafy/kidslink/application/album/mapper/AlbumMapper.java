package com.ssafy.kidslink.application.album.mapper;

import com.ssafy.kidslink.application.album.domain.Album;
import com.ssafy.kidslink.application.album.dto.AlbumDTO;
import com.ssafy.kidslink.application.child.mapper.ChildMapper;
import com.ssafy.kidslink.application.image.domain.Image;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import com.ssafy.kidslink.application.image.mapper.ImageMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AlbumMapper {

    private final ImageMapper imageMapper;
    private final ChildMapper childMapper;

    public AlbumMapper(ImageMapper imageMapper, ChildMapper childMapper) {
        this.imageMapper = imageMapper;
        this.childMapper = childMapper;
    }

    public AlbumDTO toDTO(Album album) {
        AlbumDTO albumDTO = new AlbumDTO();
        albumDTO.setAlbumId(album.getAlbumId());
        albumDTO.setAlbumDate(album.getAlbumDate());
        albumDTO.setAlbumName(album.getAlbumName());
        albumDTO.setChild(childMapper.toDTO(album.getChild()));
        List<ImageDTO> images = new ArrayList<>();
        for (Image image : album.getImages()) {
            images.add(imageMapper.toDTO(image));
        }
        albumDTO.setImages(images);
        return albumDTO;
    }
}
