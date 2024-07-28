package com.ssafy.kidslink.common.exception;

public class JWTAuthorizationException extends RuntimeException {
    public JWTAuthorizationException(String message) {
        super(message);
    }

    public JWTAuthorizationException(String message, Throwable cause) {
        super(message, cause);
    }
}