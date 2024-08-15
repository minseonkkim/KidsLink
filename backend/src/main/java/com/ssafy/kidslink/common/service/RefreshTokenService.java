package com.ssafy.kidslink.common.service;

import com.ssafy.kidslink.common.exception.JWTAuthenticationException;
import com.ssafy.kidslink.common.jwt.JWTUtil;
import com.ssafy.kidslink.common.redis.RefreshToken;
import com.ssafy.kidslink.common.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final TokenStorageService tokenStorageService;
    private final JWTUtil jwtUtil;

    @Transactional
    public void saveTokenInfo(String username, String accessToken, String refreshToken) {
        String sessionId = UUID.randomUUID().toString();
        String id = username + "-" + sessionId;  // 고유 ID 생성
        RefreshToken refreshTokenObj = new RefreshToken(id, accessToken, refreshToken, username);
        tokenStorageService.save(refreshTokenObj);
    }

    @Transactional
    public void removeRefreshToken(String refreshToken) {
        RefreshToken token = tokenStorageService.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new JWTAuthenticationException("Invalid refresh token"));

        tokenStorageService.delete(token);
    }

    public RefreshToken getRefreshToken(String refreshToken) {
        return tokenStorageService.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new JWTAuthenticationException("Token not found"));
    }

    @Transactional
    public RefreshToken refreshAccessToken(String refreshToken) {
        if (jwtUtil.isExpired(refreshToken)) {
            throw new JWTAuthenticationException("Refresh token is expired");
        }

        RefreshToken token = tokenStorageService.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new JWTAuthenticationException("Invalid refresh token"));

        // 새로운 액세스 토큰 발급
        String newAccessToken = jwtUtil.createJwt(
                "access",  // 카테고리를 "access"로 설정
                jwtUtil.isOAuth2(refreshToken),
                jwtUtil.getUsername(refreshToken),
                jwtUtil.getRole(refreshToken),
                JWTUtil.ACCESS_TOKEN_VALIDITY_SECONDS);

        // 새로운 리프레시 토큰 발급
        String newRefreshToken = jwtUtil.createJwt(
                "refresh",  // 카테고리를 "refresh"로 설정
                jwtUtil.isOAuth2(refreshToken),
                jwtUtil.getUsername(refreshToken),
                jwtUtil.getRole(refreshToken),
                JWTUtil.REFRESH_TOKEN_VALIDITY_SECONDS);

        // 기존 리프레시 토큰 정보를 업데이트
        token.updateToken(newAccessToken, newRefreshToken);
        tokenStorageService.save(token);

        // 새로운 액세스 토큰 반환
        return token;
    }
}