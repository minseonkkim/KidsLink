package com.ssafy.kidslink.common.storage;

import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

public class S3Condition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        String useS3 = context.getEnvironment().getProperty("use.s3");
        String accessKey = context.getEnvironment().getProperty("cloud.aws.credentials.access-key");
        String secretKey = context.getEnvironment().getProperty("cloud.aws.credentials.secret-key");
        String region = context.getEnvironment().getProperty("cloud.aws.region.static");
        return "true".equals(useS3) && accessKey != null && secretKey != null && region != null;
    }
}