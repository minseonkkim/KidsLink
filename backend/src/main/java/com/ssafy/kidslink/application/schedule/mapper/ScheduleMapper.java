package com.ssafy.kidslink.application.schedule.mapper;

import com.ssafy.kidslink.application.schedule.domain.Schedule;
import com.ssafy.kidslink.application.schedule.dto.ScheduleDTO;
import org.springframework.stereotype.Component;

@Component
public class ScheduleMapper {
    public ScheduleDTO toDTO(Schedule schedule) {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setId(schedule.getScheduleId());
        dto.setDate(schedule.getScheduleDate());
        dto.setContent(schedule.getScheduleName());
        return dto;
    }
}
