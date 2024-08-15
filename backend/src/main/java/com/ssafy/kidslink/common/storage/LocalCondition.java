package com.ssafy.kidslink.common.storage;

import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

public class LocalCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        String useS3 = context.getEnvironment().getProperty("use.s3");
        return !"true".equals(useS3);
    }
}