package com.ssafy.kidslink.application.image.service;

import com.ssafy.kidslink.application.image.domain.Image;
import com.ssafy.kidslink.application.image.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {

//    private final S3Config s3Config;
    private final ImageRepository imageRepository;
//    @Value("${cloud.aws.s3.bucket}")
//    private String bucket;

    @Value("${file.path}")
    private String LOCAL_LOCATION;

    public String imageUpload(MultipartRequest request) throws IOException {
        String today = new SimpleDateFormat("yyMMdd").format(new Date());
        String saveFolder = LOCAL_LOCATION + File.separator + today;

        File folder = new File(saveFolder);
        if(!folder.exists())
            folder.mkdirs();

        MultipartFile file = request.getFile("file");
        String fileName = file.getOriginalFilename();
        String ext = fileName.substring(fileName.indexOf("."));

        String saveFileName = UUID.randomUUID() + ext;

        File localFile = new File(folder, saveFileName);
        file.transferTo(localFile);

        Image image = new Image();
        image.setSaveFolder(saveFolder);
        image.setOriginalFile(fileName);
        image.setSaveFile(saveFileName);

        imageRepository.save(image);

//
//
//        s3Config.amazonS3Client().putObject(new PutObjectRequest(bucket, uuidFileName, localFile).withCannedAcl(CannedAccessControlList.PublicRead));
//        String s3Url = s3Config.amazonS3Client().getUrl(bucket, uuidFileName).toString();
//
//        localFile.delete();
//
//        return s3Url;

        return localFile.getAbsolutePath() + "" + localFile.getName();
    }

}
