package com.ssafy.kidslink.common.service;

import com.ssafy.kidslink.common.redis.RefreshToken;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
@Profile("dev")
public class InMemoryTokenStorageService implements TokenStorageService, InitializingBean {

    private final ConcurrentHashMap<String, RefreshToken> tokenStore = new ConcurrentHashMap<>();

    @Override
    public void save(RefreshToken token) {
        tokenStore.put(token.getId(), token);
    }

    @Override
    public void delete(RefreshToken token) {
        tokenStore.remove(token.getId());
    }

    @Override
    public Optional<RefreshToken> findByRefreshToken(String refreshToken) {
        return tokenStore.values().stream()
                .filter(t -> t.getRefreshToken().equals(refreshToken))
                .findFirst();
    }

    @Override
    public void afterPropertiesSet() {
        log.info("Token Storage initialized: In-Memory Storage");
    }
}