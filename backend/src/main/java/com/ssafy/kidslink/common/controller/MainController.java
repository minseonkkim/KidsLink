package com.ssafy.kidslink.common.controller;

import com.ssafy.kidslink.common.dto.APIError;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.jwt.JWTUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

import static com.ssafy.kidslink.common.util.CookieUtil.createCookie;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class MainController {

    private final JWTUtil jwtUtil;

    @PostMapping("/reissue")
    public ResponseEntity<APIResponse<Map<String, Object>>> generateRefreshToken(HttpServletRequest request, HttpServletResponse response) {
        log.info("Generate refresh token");

        // TODO #2 access 토큰 존재 시 처리 로직 추가

        Map<String, Object> responseMap = new HashMap<>();
        String refresh = null;

        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("refresh")) {
                refresh = cookie.getValue();
                break;
            }
        }

        log.info("refresh: {}", refresh);

        APIResponse<Map<String, Object>> responseData = new APIResponse<>(
                "error",
                null,
                null,
                null
        );

        if (refresh == null) {
            responseData.setMessage("JWT 재발급에 실패했습니다.");
            responseData.setError(new APIError("REFRESH_TOKEN_EXPIRED", "Refresh Token 만료. 다시 로그인해 주세요."));
            return new ResponseEntity<>(responseData, HttpStatus.UNAUTHORIZED);
        }

        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            responseData.setMessage("JWT 재발급에 실패했습니다.");
            responseData.setError(new APIError("REFRESH_TOKEN_EXPIRED", "Refresh Token 만료. 다시 로그인해 주세요."));
            return new ResponseEntity<>(responseData, HttpStatus.UNAUTHORIZED);
        }

        String category = jwtUtil.getCategory(refresh);
        if (!category.equals("refresh")) {
            responseData.setMessage("invalid refresh token");
            responseData.setError(new APIError("NOT_REFRESH_TOKEN", "invalid refresh token"));
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }

        String username = jwtUtil.getUsername(refresh);
        String role = jwtUtil.getRole(refresh);
        Boolean oauth2 = jwtUtil.isOAuth2(refresh);

        String newAccess = jwtUtil.createJwt("access", oauth2, username, role, JWTUtil.ACCESS_TOKEN_VALIDITY_SECONDS);
        String newRefresh = jwtUtil.createJwt("refresh", oauth2, username, role, JWTUtil.REFRESH_TOKEN_VALIDITY_SECONDS);

        response.setHeader("access", newAccess);
        response.addCookie(createCookie("refresh", newRefresh));

        // TODO #1. refresh token Redis 삭제 및 저장

        responseData.setStatus("success");
        responseData.setMessage("JWT 재발급 성공");

        responseMap.put("token", newAccess);
        responseMap.put("expiredAt", System.currentTimeMillis() + JWTUtil.ACCESS_TOKEN_VALIDITY_SECONDS);

        responseData.setData(responseMap);

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
