package com.ssafy.kidslink.application.child.dto;

import com.ssafy.kidslink.application.kindergarten.dto.KindergartenClassDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ChildDTO {
    private int childId;
    private String name;
    private KindergartenClassDTO kindergartenClass;
    private String gender;
    private String birth;
    private String profile;
}
