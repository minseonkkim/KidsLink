package com.ssafy.kidslink.common.service;

import com.ssafy.kidslink.common.redis.RefreshToken;
import com.ssafy.kidslink.common.repository.RefreshTokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
@Profile("prod")
public class RedisTokenStorageService implements TokenStorageService, InitializingBean {

    private final RefreshTokenRepository refreshTokenRepository;

    public RedisTokenStorageService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Override
    public void save(RefreshToken token) {
        refreshTokenRepository.save(token);
    }

    @Override
    public void delete(RefreshToken token) {
        refreshTokenRepository.delete(token);
    }

    @Override
    public Optional<RefreshToken> findByRefreshToken(String refreshToken) {
        return refreshTokenRepository.findByRefreshToken(refreshToken);
    }

    @Override
    public void afterPropertiesSet() {
        log.info("Token Storage Service initialized: Redis Storage");
    }
}