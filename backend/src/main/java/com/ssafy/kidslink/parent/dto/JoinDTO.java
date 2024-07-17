package com.ssafy.kidslink.parent.dto;

import com.ssafy.kidslink.child.dto.ChildDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class JoinDTO {
    private String username;
    private String email;
    private String password;
    private String passwordConfirm;
    private String name;
    private String nickname;
    private String tel;
    private ChildDTO childDTO;
}
