package com.ssafy.kidslink.application.image.service;

import com.ssafy.kidslink.application.image.domain.Image;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import com.ssafy.kidslink.application.image.repository.ImageRepository;
import com.ssafy.kidslink.common.storage.S3StorageService;
import com.ssafy.kidslink.common.storage.StorageService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

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
