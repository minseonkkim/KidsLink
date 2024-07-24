package com.ssafy.kidslink.application.schedule.service;

import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.schedule.domain.Schedule;
import com.ssafy.kidslink.application.schedule.dto.ScheduleDTO;
import com.ssafy.kidslink.application.schedule.mapper.ScheduleMapper;
import com.ssafy.kidslink.application.schedule.repository.ScheduleRepository;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduleService {

    private final TeacherRepository teacherRepository;
    private final ScheduleRepository scheduleRepository;
    private final ParentRepository parentRepository;
    private final ScheduleMapper scheduleMapper;

    public List<ScheduleDTO> getSchedules(String role, String userName) {
        List<ScheduleDTO> schedules = new ArrayList<>();
        if(role.equals("ROLE_TEACHER")){
            Teacher teacher = teacherRepository.findByTeacherUsername(userName);
            for(Schedule schedule : scheduleRepository.findByKindergarten(teacher.getKindergartenClass().getKindergarten())){
                schedules.add(scheduleMapper.toDTO(schedule));
            }
        }else{
            Parent parent = parentRepository.findByParentUsername(userName);
            for(Schedule schedule: scheduleRepository.findByKindergarten(parent.getChildren().stream().findFirst().get().getKindergartenClass().getKindergarten())){
                schedules.add(scheduleMapper.toDTO(schedule));
            }
        }
        return schedules;
    }
}
