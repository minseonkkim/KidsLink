package com.ssafy.kidslink.common.util;

import java.util.UUID;

public class IdGenerator {
    public static String generateUniqueId() {
        return UUID.randomUUID().toString();
    }
}