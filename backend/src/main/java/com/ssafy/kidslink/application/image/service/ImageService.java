package com.ssafy.kidslink.application.image.service;

import com.ssafy.kidslink.application.image.domain.Image;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import com.ssafy.kidslink.application.image.repository.ImageRepository;
import com.ssafy.kidslink.common.storage.S3StorageService;
import com.ssafy.kidslink.common.storage.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageService {
    private final ImageRepository imageRepository;
    private final StorageService storageService;

    public ImageDTO storeFile(MultipartFile file) throws IOException {
        String savedFileName = storageService.storeFile(file);

        Image image = new Image();
        image.setSaveFolder(storageService instanceof S3StorageService ? "s3" : "local");
        image.setOriginalFile(file.getOriginalFilename());
        image.setSaveFile(savedFileName);

        Image savedImage = imageRepository.save(image);

        ImageDTO imageDTO = new ImageDTO();
        imageDTO.setImageId(savedImage.getImageId());
        String url = storageService instanceof S3StorageService ? savedFileName : getUriString(image.getSaveFile());
        imageDTO.setPath(url);

        return imageDTO;
    }

    public Resource loadFileAsResourceByLocalStorage(String fileName) {
        return storageService.loadFileAsResource(fileName);
    }

    public Image getImageById(int imageId) {
        return imageRepository.findById(imageId).orElseThrow();
    }

    public static String getUriString(String fileName) {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/image/")
                .path(fileName)
                .toUriString();
    }

}
