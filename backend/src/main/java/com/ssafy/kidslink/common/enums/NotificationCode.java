package com.ssafy.kidslink.common.enums;

import lombok.Getter;

@Getter
public enum NotificationCode {
    DIARY("diary"),
    NOTICE("notice"),
    ALBUM("album"),
    BUS("bus"),
    MEETING("meeting"),
    DOCUMENT("document");

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