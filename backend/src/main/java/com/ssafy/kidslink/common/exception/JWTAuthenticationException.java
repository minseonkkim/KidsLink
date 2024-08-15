package com.ssafy.kidslink.common.exception;

public class JWTAuthenticationException extends RuntimeException {
    public JWTAuthenticationException(String message) {
        super(message);
    }

    public JWTAuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}