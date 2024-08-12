package com.ssafy.kidslink.application.parent.dto;

import com.ssafy.kidslink.application.child.dto.ChildDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
public class ParentIdDTO {
    private String parentId;
    private String username;
    private String email;
    private String name;
    private String nickname;
    private String tel;
    private ChildDTO child;
    private String profile;
}
