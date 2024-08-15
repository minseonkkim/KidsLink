package com.ssafy.kidslink.common.enums;

public enum ConfirmationStatus {
    T("T"),
    F("F");

    private final String code;

    ConfirmationStatus(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}