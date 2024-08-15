package com.ssafy.kidslink.common.redis;

import com.ssafy.kidslink.common.jwt.JWTUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.io.Serializable;

@Getter
@AllArgsConstructor
//@RedisHash(value = "jwtToken", timeToLive = 60 * 60 * 24 * 14) 14일
@RedisHash(value = "refresh_token", timeToLive = JWTUtil.REFRESH_TOKEN_VALIDITY_SECONDS / 1000)
public class RefreshToken implements Serializable {

    @Id
    private String id;  // 고유 ID (username-sessionId)

    private String accessToken;

    @Indexed
    private String refreshToken;

    private String username;

    public void updateToken(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

}