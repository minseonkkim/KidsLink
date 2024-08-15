package com.ssafy.kidslink.common.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;

public interface StorageService {
    String storeFile(MultipartFile file) throws IOException;
    Resource loadFileAsResource(String fileName);
}