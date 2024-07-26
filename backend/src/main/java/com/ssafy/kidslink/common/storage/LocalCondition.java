package com.ssafy.kidslink.common.storage;

import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

public class LocalCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        // 환경 변수 또는 프로퍼티 파일을 체크하여 로컬 스토리지 사용 여부를 결정합니다.
        return !"true".equals(context.getEnvironment().getProperty("use.s3"));
    }
}