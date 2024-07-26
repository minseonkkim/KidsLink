package com.ssafy.kidslink.application.kindergarten.dto;

import com.ssafy.kidslink.application.child.dto.ChildDTO;
import com.ssafy.kidslink.application.teacher.dto.TeacherDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class ResponseClassInfoDTO {
    KindergartenClassDTO kindergartenClass;
    TeacherDTO teacher;
    List<ChildDTO> children;
}
