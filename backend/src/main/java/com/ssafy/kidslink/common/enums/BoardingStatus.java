package com.ssafy.kidslink.common.enums;

public enum BoardingStatus {
    T("T"),
    F("F");

    private final String code;

    BoardingStatus(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}