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

    @ExceptionHandler(InvalidPrincipalException.class)
    public ResponseEntity<APIResponse<Object>> handleInvalidPrincipalException(InvalidPrincipalException ex) {
        APIResponse<Object> response = new APIResponse<>(
                "error",
                null,
                ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<APIResponse<Void>> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        APIError apiError = new APIError("USERNAME_NOT_FOUND", ex.getMessage());
        APIResponse<Void> response = new APIResponse<>(
                "fail",
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
                "error",
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
                "error",
                null,
                "서버 오류로 인해 요청이 실패했습니다.",
                apiError
        );
        return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<APIResponse<Void>> handleNotFoundException(NotFoundException e) {
        APIError apiError = new APIError("NOT_FOUND", e.getMessage());
        APIResponse<Void> responseData = new APIResponse<>(
                "fail",
                null,
                "리소스를 찾을 수 없습니다.",
                apiError
        );
        return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AlreadyExistsException.class)
    public ResponseEntity<APIResponse<Void>> handleAlreadyExistsException(AlreadyExistsException e) {
        APIError apiError = new APIError("ALREADY_EXISTS", e.getMessage());
        APIResponse<Void> responseData = new APIResponse<>(
                "fail",
                null,
                "이미 존재하는 아이디 입니다.",
                apiError
        );
        return new ResponseEntity<>(responseData, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(RequestDataException.class)
    public ResponseEntity<APIResponse<Void>> handleRequestDataException(RequestDataException e) {
        APIError apiError = new APIError("REQUEST_DATA_ERROR", e.getMessage());
        APIResponse<Void> responseData = new APIResponse<>(
                "fail",
                null,
                "요청 데이터 문제 발생",
                apiError
        );
        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(JwtAuthenticationException.class)
    public ResponseEntity<APIResponse<Void>> handleAuthenticationException(JwtAuthenticationException e) {
        APIError apiError = new APIError("AUTHENTICATION_ERROR", e.getMessage());
        APIResponse<Void> responseData = new APIResponse<>(
                "fail",
                null,
                "인증 오류가 발생했습니다.",
                apiError
        );
        return new ResponseEntity<>(responseData, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(JwtAuthorizationException.class)
    public ResponseEntity<APIResponse<Void>> handleAuthorizationException(JwtAuthorizationException e) {
        APIError apiError = new APIError("AUTHORIZATION_ERROR", e.getMessage());
        APIResponse<Void> responseData = new APIResponse<>(
                "fail",
                null,
                "권한 오류가 발생했습니다.",
                apiError
        );
        return new ResponseEntity<>(responseData, HttpStatus.FORBIDDEN);
    }
}
