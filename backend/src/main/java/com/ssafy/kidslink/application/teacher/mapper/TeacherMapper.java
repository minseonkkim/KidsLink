package com.ssafy.kidslink.application.teacher.mapper;

import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.dto.TeacherDTO;
import org.springframework.stereotype.Component;

@Component
public class TeacherMapper {
    public TeacherDTO toDTO(Teacher teacher){
        TeacherDTO dto = new TeacherDTO();
        dto.setTel(teacher.getTeacherTel());
        dto.setEmail(teacher.getTeacherEmail());
        dto.setName(teacher.getTeacherName());
        dto.setNickname(teacher.getTeacherNickname());
        dto.setUsername(teacher.getTeacherUsername());
        dto.setKindergartenId(teacher.getKindergartenClass().getKindergartenId());
        dto.setKindergartenName(teacher.getKindergartenClass().getKindergarten().getKindergartenName());
        dto.setKindergartenClassName(teacher.getKindergartenClass().getKindergartenClassName());
        dto.setProfile(teacher.getTeacherProfile());
        return dto;
    }
}
