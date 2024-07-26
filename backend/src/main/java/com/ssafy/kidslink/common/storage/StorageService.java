package com.ssafy.kidslink.common.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;

public interface StorageService {
    String storeFile(MultipartFile file) throws IOException;
    Path loadFileAsResource(String fileName);
}