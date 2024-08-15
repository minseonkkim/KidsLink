package com.ssafy.kidslink.application.child.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class JoinChildDTO {
    private int childId;
    private String name;
    private int kindergartenId;
    private int kindergartenClassId;
    private String gender;
    private String birth;
}
