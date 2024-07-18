package com.ssafy.kidslink.application.parent.dto;

import com.ssafy.kidslink.application.child.dto.ChildDTO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ParentDTO {
    private String username;
    private String email;
    private String name;
    private String nickname;
    private String tel;
    private ChildDTO child;
}
