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
    private final ImageService imageService;

    public ImageDTO toDTO(Image image) {
        return imageService.createImageDTO(image);
    }

    public Image toEntity(ImageDTO imageDTO) {
        return imageRepository.findById(imageDTO.getImageId()).orElseThrow();
    }
}
