package com.ssafy.kidslink.common.storage;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.*;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
@Conditional(S3Condition.class)
@RequiredArgsConstructor
public class S3StorageService implements StorageService {
    private final AmazonS3Client amazonS3Client;
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;
    @Value("${file.max-size}")
    private long maxFileSize;

    @Override
    public String storeFile(MultipartFile file) throws IOException {
        byte[] fileData;
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        if (file.getSize() > maxFileSize) {
            fileData = compressFile(file);
        } else {
            fileData = file.getBytes();
        }

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(fileData.length);
        metadata.setContentType(file.getContentType());

        ByteArrayInputStream inputStream = new ByteArrayInputStream(fileData);

        amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, inputStream, metadata)
                .withCannedAcl(CannedAccessControlList.PublicRead));

        return amazonS3Client.getUrl(bucket, fileName).toString();
    }

    @Override
    public Resource loadFileAsResource(String fileName) {
        S3Object s3Object = amazonS3Client.getObject(bucket, fileName);
        S3ObjectInputStream inputStream = s3Object.getObjectContent();
        return new InputStreamResource(inputStream);
    }

    private byte[] compressFile(MultipartFile file) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        Thumbnails.of(file.getInputStream())
                .size(1200, 1200) // 최대 크기를 1200으로 설정 (가로 또는 세로 중 더 긴 쪽에 맞춤)
                .outputQuality(0.7) // 이미지 품질을 80%로 설정 (0.0에서 1.0 사이의 값)
                .keepAspectRatio(true) // 비율을 유지
                .toOutputStream(outputStream);

        return outputStream.toByteArray();
    }
}