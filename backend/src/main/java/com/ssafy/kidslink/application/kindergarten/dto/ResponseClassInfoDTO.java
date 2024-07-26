package com.ssafy.kidslink.application.kindergartenclass.dto;

import com.ssafy.kidslink.application.child.dto.ChildDTO;
import com.ssafy.kidslink.application.teacher.dto.TeacherDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class ResponseClassInfoDTO {
    int kindergartenClassId;
    TeacherDTO teacher;
    List<ChildDTO> children;
}
