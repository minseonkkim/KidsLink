package com.ssafy.kidslink.application.image.service;

import com.ssafy.kidslink.application.image.domain.Image;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import com.ssafy.kidslink.application.image.repository.ImageRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
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

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${file.max-size}")
    private long maxFileSize;

    @PostConstruct
    public void init() {
        log.info("upload dir: {}", uploadDir);
        try {
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    public ImageDTO storeFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String savedFileName = "";
        if (file.getSize() > maxFileSize) {
            savedFileName = storeCompressedFile(file);
        } else {
            savedFileName = storeRegularFile(file);
        }
        Image image = new Image();
        image.setSaveFolder(uploadDir);
        image.setOriginalFile(originalFilename);
        image.setSaveFile(savedFileName);

        Image savedImage = imageRepository.save(image);

        // If you want to upload to S3
        // s3Config.amazonS3Client().putObject(new PutObjectRequest(bucket, saveFileName, localFile).withCannedAcl(CannedAccessControlList.PublicRead));
        // String s3Url = s3Config.amazonS3Client().getUrl(bucket, saveFileName).toString();
        // savedFilePaths.add(s3Url);

        ImageDTO imageDTO = new ImageDTO();
        imageDTO.setImageId(savedImage.getImageId());
        String url = getUriString(image.getSaveFile());
        imageDTO.setPath(url);

        return imageDTO;
    }

    public Path loadFileAsResource(String fileName) {
        return Paths.get(uploadDir).toAbsolutePath().normalize().resolve(fileName);
    }

    private static String getUriString(String fileName) {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/image/")
                .path(fileName)
                .toUriString();
    }

    private String storeRegularFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir).resolve(fileName);
        System.out.println(filePath);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }

    private String storeCompressedFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename() + ".zip";
        Path filePath = Paths.get(uploadDir).resolve(fileName);

        try (ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(filePath.toFile()))) {
            zipOut.putNextEntry(new ZipEntry(file.getOriginalFilename()));
            zipOut.write(file.getBytes());
            zipOut.closeEntry();
        }

        return fileName;
    }

    private ImageDTO fileSave(MultipartFile file, File folder, String saveFolder) throws IOException {
        String fileName = file.getOriginalFilename();
        String ext = fileName.substring(fileName.lastIndexOf("."));

        String saveFileName = UUID.randomUUID() + ext;

        File localFile = new File(folder, saveFileName);
        file.transferTo(localFile);

        Image image = new Image();
        image.setSaveFolder(saveFolder);
        image.setOriginalFile(fileName);
        image.setSaveFile(saveFileName);

        Image savedImage = imageRepository.save(image);

        // If you want to upload to S3
        // s3Config.amazonS3Client().putObject(new PutObjectRequest(bucket, saveFileName, localFile).withCannedAcl(CannedAccessControlList.PublicRead));
        // String s3Url = s3Config.amazonS3Client().getUrl(bucket, saveFileName).toString();
        // savedFilePaths.add(s3Url);

        ImageDTO imageDTO = new ImageDTO();
        imageDTO.setImageId(savedImage.getImageId());
        imageDTO.setPath(localFile.getAbsolutePath());

        return imageDTO;
    }

}
