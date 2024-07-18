package com.ssafy.kidslink.application.teacher.dto;

import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
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
    private String kindergartenName;
    private String kindergartenClassName;
}
