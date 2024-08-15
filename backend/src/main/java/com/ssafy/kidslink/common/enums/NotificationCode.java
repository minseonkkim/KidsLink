package com.ssafy.kidslink.common.enums;

import lombok.Getter;

@Getter
public enum NotificationCode {
    DIARY("DIARY"),
    NOTICE("NOTICE"),
    ALBUM("ALBUM"),
    BUS("BUS"),
    MEETING("MEETING"),
    DOCUMENT("DOCUMENT");

    private final String code;

    NotificationCode(String code) {
        this.code = code;
    }

    public static NotificationCode fromCode(String code) {
        for (NotificationCode notificationCode : NotificationCode.values()) {
            if (notificationCode.getCode().equalsIgnoreCase(code)) {
                return notificationCode;
            }
        }
        throw new IllegalArgumentException("Unknown code: " + code);
    }
}