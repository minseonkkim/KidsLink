package com.ssafy.kidslink.common.exception;

import com.ssafy.kidslink.common.dto.APIError;
import com.ssafy.kidslink.common.dto.APIResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
@Slf4j
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

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<APIResponse<Void>> handleDataAccessException(DataAccessException e) {
        log.error("Database error occurred", e);
        APIError apiError = new APIError("DATABASE_ERROR", "데이터베이스 오류가 발생했습니다.");
        APIResponse<Void> responseData = new APIResponse<>(
                "fail",
                null,
                "데이터베이스 오류로 인해 요청이 실패했습니다.",
                apiError
        );
        return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse<Void>> handleException(Exception e) {
        log.error("An error occurred", e);
        APIError apiError = new APIError("ERROR", "서버 오류가 발생했습니다.");
        APIResponse<Void> responseData = new APIResponse<>(
                "fail",
                null,
                "서버 오류로 인해 요청이 실패했습니다.",
                apiError
        );
        return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
