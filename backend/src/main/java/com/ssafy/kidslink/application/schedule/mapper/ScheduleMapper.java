package com.ssafy.kidslink.application.schedule.mapper;

import com.ssafy.kidslink.application.schedule.domain.Schedule;
import com.ssafy.kidslink.application.schedule.dto.KindergartenScheduleDTO;
import org.springframework.stereotype.Component;

@Component
public class ScheduleMapper {
    public KindergartenScheduleDTO toDTO(Schedule schedule) {
        KindergartenScheduleDTO dto = new KindergartenScheduleDTO();
        dto.setId(schedule.getScheduleId());
        dto.setDate(schedule.getScheduleDate());
        dto.setContent(schedule.getScheduleName());
        return dto;
    }
}
