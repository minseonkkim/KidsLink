package com.ssafy.kidslink.common.storage;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
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

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Override
    public String storeFile(MultipartFile file) throws IOException {
        File localFile = convertMultipartFileToFile(file);
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        amazonS3.putObject(new PutObjectRequest(bucket, fileName, localFile).withCannedAcl(CannedAccessControlList.PublicRead));
        localFile.delete();
        return amazonS3.getUrl(bucket, fileName).toString();
    }

    @Override
    public Path loadFileAsResource(String fileName) {
        // Not applicable for S3. S3 files are accessed via URL.
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