package com.ssafy.kidslink.common.jwt;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JWTTokenDTO {
    private String access;
    private String refresh;
}
