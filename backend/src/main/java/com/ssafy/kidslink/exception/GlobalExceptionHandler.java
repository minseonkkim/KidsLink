package com.ssafy.kidslink.exception;

import com.ssafy.kidslink.api.APIError;
import com.ssafy.kidslink.api.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class GlobalExceptionHandler {



    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<APIResponse<Void>> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        APIError apiError = new APIError("USERNAME_NOT_FOUND", ex.getMessage());
        APIResponse<Void> response = new APIResponse<>(
                "error",
                null,
                "Username not found",
                apiError
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

}
