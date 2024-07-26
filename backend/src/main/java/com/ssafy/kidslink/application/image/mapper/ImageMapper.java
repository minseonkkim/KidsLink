package com.ssafy.kidslink.application.image.mapper;

import com.ssafy.kidslink.application.image.domain.Image;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import com.ssafy.kidslink.application.image.repository.ImageRepository;
import com.ssafy.kidslink.application.image.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ImageMapper {
    private final ImageRepository imageRepository;

    public ImageDTO toDTO(Image image) {
        ImageDTO imageDTO = new ImageDTO();
        imageDTO.setImageId(image.getImageId());
        imageDTO.setPath(ImageService.getUriString(image.getSaveFile()));
        return imageDTO;
    }

    public Image toEntity(ImageDTO imageDTO) {
        return imageRepository.findById(imageDTO.getImageId()).orElseThrow();
    }
}
