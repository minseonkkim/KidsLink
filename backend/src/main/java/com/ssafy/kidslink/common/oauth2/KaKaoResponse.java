package com.ssafy.kidslink.common.oauth2;

import java.util.Map;

public class KaKaoResponse implements OAuth2Response{
    private final Map<String, Object> attribute;
    private Map<String, Object> kakaoAcount;

    public KaKaoResponse(Map<String, Object> attribute) {
        this.attribute = attribute;
        kakaoAcount = (Map<String, Object>) attribute.get("kakao_account");
    }

    @Override
    public String getProvider() {
        return "kakao";
    }

    @Override
    public String getProviderId() {

        return attribute.get("id").toString();
    }

    @Override
    public String getEmail() {
        return kakaoAcount.get("email").toString();
    }

    @Override
    public String getName() {
        if (kakaoAcount.containsKey("profile") && ((Map<String, Object>) kakaoAcount.get("profile")).containsKey("nickname")) {
            return ((Map<String, Object>) kakaoAcount.get("profile")).get("nickname").toString();
        }
        return null;
    }
}
