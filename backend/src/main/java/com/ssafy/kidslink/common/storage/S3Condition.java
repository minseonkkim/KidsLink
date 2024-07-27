package com.ssafy.kidslink.common.storage;

import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

public class S3Condition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        // S3 사용 여부를 결정하는 로직을 작성합니다.
        // 예를 들어, 환경 변수를 체크하여 S3 사용 여부를 결정할 수 있습니다.
        return "true".equals(context.getEnvironment().getProperty("use.s3"));
    }
}