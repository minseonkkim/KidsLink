package com.ssafy.kidslink.application.schedule.mapper;

import com.ssafy.kidslink.application.schedule.domain.TeacherSchedule;
import com.ssafy.kidslink.application.schedule.dto.TeacherScheduleDTO;
import org.springframework.stereotype.Component;

@Component
public class TeacherScheduleMapper {
    public TeacherScheduleDTO toDTO(TeacherSchedule teacherSchedule) {
        TeacherScheduleDTO dto = new TeacherScheduleDTO();
        dto.setId(teacherSchedule.getTeacherScheduleId());
        dto.setDate(teacherSchedule.getTeacherScheduleDate());
        dto.setContent(teacherSchedule.getTeacherScheduleContents());
        return dto;
    }
}
