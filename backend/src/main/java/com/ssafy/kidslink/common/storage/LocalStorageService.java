package com.ssafy.kidslink.common.storage;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Conditional;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Conditional(LocalCondition.class)
@RequiredArgsConstructor
@Slf4j
public class LocalStorageService implements StorageService {
    @Value("${file.upload-dir}")
    private String UPLOAD_DIR;
    @Value("${file.max-size}")
    private long maxFileSize;

    @PostConstruct
    public void init() {
        log.debug("upload dir: {}", UPLOAD_DIR);
        try {
            Path path = Paths.get(UPLOAD_DIR);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    @Override
    public String storeFile(MultipartFile file) throws IOException {
        String savedFileName;
        if (file.getSize() > maxFileSize) {
            savedFileName = storeCompressedFile(file);
        } else {
            savedFileName = storeRegularFile(file);
        }
        return savedFileName;
    }

    @Override
    public Resource loadFileAsResource(String fileName) {
        Path filePath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize().resolve(fileName);
        try {
            return new UrlResource(filePath.toUri());
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
    }

    private String storeRegularFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }

    private String storeCompressedFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);

        // 메모리 내에서 이미지 압축
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        Thumbnails.of(file.getInputStream())
                .size(1200, 1200) // 최대 크기를 1200으로 설정 (가로 또는 세로 중 더 긴 쪽에 맞춤)
                .outputQuality(0.8) // 이미지 품질을 80%로 설정 (0.0에서 1.0 사이의 값)
                .keepAspectRatio(true) // 비율을 유지
                .toOutputStream(outputStream);

        // 압축된 이미지를 파일로 저장
        byte[] compressedData = outputStream.toByteArray();
        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(compressedData)) {
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        }

        return fileName;
    }

}