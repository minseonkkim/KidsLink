package com.ssafy.kidslink.common.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter

public class User {
    private String username;
    private String password;
    private String role;

    public User() {}

    public User(String username, String role) {
        this.username = username;
        this.role = role;
    }
}
