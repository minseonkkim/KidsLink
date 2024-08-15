package com.ssafy.kidslink.common.storage;

import com.amazonaws.services.s3.AmazonS3Client;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class StorageServiceInitializer implements ApplicationListener<ApplicationReadyEvent> {
    @Autowired(required = false)
    private S3StorageService s3StorageService;
    @Autowired(required = false)
    private LocalStorageService localStorageService;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        if (s3StorageService != null) {
            log.info("Storage Service initialized: S3");
        } else if (localStorageService != null) {
            log.info("Storage Service initialized: Local Storage");
        } else {
            log.warn("No Storage Service initialized");
        }
    }
}