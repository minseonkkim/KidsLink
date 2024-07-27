package com.ssafy.kidslink.common.storage;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Conditional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    public Path loadFileAsResource(String fileName) {
        return Paths.get(UPLOAD_DIR).toAbsolutePath().normalize().resolve(fileName);
    }

    private String storeRegularFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }

    private String storeCompressedFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename() + ".zip";
        Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);

        try (ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(filePath.toFile()))) {
            zipOut.putNextEntry(new ZipEntry(file.getOriginalFilename()));
            zipOut.write(file.getBytes());
            zipOut.closeEntry();
        }

        return fileName;
    }
}