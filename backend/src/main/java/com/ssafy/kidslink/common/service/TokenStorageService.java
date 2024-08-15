package com.ssafy.kidslink.common.service;

import com.ssafy.kidslink.common.redis.RefreshToken;

import java.util.Optional;

public interface TokenStorageService {
    void save(RefreshToken token);
    void delete(RefreshToken token);
    Optional<RefreshToken> findByRefreshToken(String refreshToken);
}