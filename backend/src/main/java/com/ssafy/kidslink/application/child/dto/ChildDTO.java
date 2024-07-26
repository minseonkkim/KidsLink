package com.ssafy.kidslink.application.child.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@ToString
public class ChildDTO {
    private String name;
    private String kindergartenClassName;  // 또는 반 ID를 나타내는 필드로 변경 가능
    private String kindergartenName;  // 또는 유치원 ID를 나타내는 필드로 변경 가능
    private String gender;
    private String birth;
    private String profile;
    private MultipartFile childProfile;
}
