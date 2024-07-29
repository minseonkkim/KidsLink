package com.ssafy.kidslink.application.teacher.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TeacherDTO {
    private String username;
    private String email;
    private String name;
    private String nickname;
    private String tel;
    private int kindergartenId;
    private String kindergartenName;
    private String kindergartenClassName;
    private String profile;
}
