package com.ssafy.kidslink.common.storage;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.kidslink.config.S3Config;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;

@Service
@Conditional(S3Condition.class)
@RequiredArgsConstructor
public class S3StorageService implements StorageService {
    private final AmazonS3Client amazonS3Client;
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Override
    public String storeFile(MultipartFile file) throws IOException {
        File localFile = convertMultipartFileToFile(file);
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, localFile)
                .withCannedAcl(CannedAccessControlList.PublicRead));
        String s3Url = amazonS3Client.getUrl(bucket, fileName).toString();

        localFile.delete();
        return s3Url;
    }

    @Override
    public Path loadFileAsResource(String fileName) {
        return null;
    }

    private File convertMultipartFileToFile(MultipartFile file) throws IOException {
        File convFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }
}