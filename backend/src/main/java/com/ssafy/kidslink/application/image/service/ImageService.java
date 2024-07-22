package com.ssafy.kidslink.application.image.service;

import com.ssafy.kidslink.application.image.domain.Image;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import com.ssafy.kidslink.application.image.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {
    private final ImageRepository imageRepository;

    @Value("${file.path}")
    private String LOCAL_LOCATION;

    public List<ImageDTO> imageUpload(MultipartRequest request) throws IOException {
        String today = new SimpleDateFormat("yyMMdd").format(new Date());
        String saveFolder = LOCAL_LOCATION + File.separator + today;

        File folder = new File(saveFolder);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        List<ImageDTO> savedFilePaths = new ArrayList<>();
        List<MultipartFile> files = request.getFiles("files");

        for (MultipartFile file : files) {
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

            savedFilePaths.add(imageDTO);
        }
        return savedFilePaths;
    }


}
