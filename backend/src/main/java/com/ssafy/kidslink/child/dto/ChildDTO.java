package com.ssafy.kidslink.child.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChildDTO {
    private String name;
    private String kindergartenClassName;  // 또는 반 ID를 나타내는 필드로 변경 가능
    private String kindergartenName;  // 또는 유치원 ID를 나타내는 필드로 변경 가능
    private String gender;
    private String birth;
}
