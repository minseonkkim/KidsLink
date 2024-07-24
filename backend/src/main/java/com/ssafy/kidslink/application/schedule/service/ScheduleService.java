package com.ssafy.kidslink.application.schedule.service;

import com.ssafy.kidslink.application.meetingschedule.domain.MeetingSchedule;
import com.ssafy.kidslink.application.meetingschedule.dto.MeetingScheduleDTO;
import com.ssafy.kidslink.application.meetingschedule.mapper.MeetingScheduleMapper;
import com.ssafy.kidslink.application.meetingschedule.repository.MeetingScheduleRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.schedule.domain.Schedule;
import com.ssafy.kidslink.application.schedule.domain.TeacherSchedule;
import com.ssafy.kidslink.application.schedule.dto.AllTeacherScheduleDTO;
import com.ssafy.kidslink.application.schedule.dto.KindergartenScheduleDTO;
import com.ssafy.kidslink.application.schedule.dto.TeacherScheduleDTO;
import com.ssafy.kidslink.application.schedule.mapper.ScheduleMapper;
import com.ssafy.kidslink.application.schedule.mapper.TeacherScheduleMapper;
import com.ssafy.kidslink.application.schedule.repository.ScheduleRepository;
import com.ssafy.kidslink.application.schedule.repository.TeacherScheduleRepository;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import com.ssafy.kidslink.application.teacherschedule.domain.TeacherSchedule;
import com.ssafy.kidslink.application.teacherschedule.repository.TeacherScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduleService {

    private final TeacherRepository teacherRepository;
    private final ScheduleRepository scheduleRepository;
    private final TeacherScheduleRepository teacherScheduleRepository;

    private final ParentRepository parentRepository;
    private final TeacherScheduleRepository teacherScheduleRepository;
    private final ScheduleMapper scheduleMapper;
    private final MeetingScheduleMapper meetingScheduleMapper;
    private final MeetingScheduleRepository meetingScheduleRepository;
    private final TeacherScheduleMapper teacherScheduleMapper;

    public AllTeacherScheduleDTO getTeacherSchedule(String userName, LocalDate date){
        Teacher teacher = teacherRepository.findByTeacherUsername(userName);

        AllTeacherScheduleDTO schedules = new AllTeacherScheduleDTO();
        schedules.setDate(date);

        List<MeetingScheduleDTO> meetingSchedules = new ArrayList<>();
        for(MeetingSchedule meetingSchedule : meetingScheduleRepository.findByTeacherAndMeetingScheduleDate(teacher,date)){
            meetingSchedules.add(meetingScheduleMapper.toDTO(meetingSchedule));
        }
        schedules.setMeetingSchedules(meetingSchedules);

        List<KindergartenScheduleDTO> kindergartenSchedules = new ArrayList<>();
        for(Schedule schedule : scheduleRepository.findByKindergartenAndScheduleDate(teacher.getKindergartenClass().getKindergarten(), date)){
            kindergartenSchedules.add(scheduleMapper.toDTO(schedule));
        }
        schedules.setKindergartenSchedules(kindergartenSchedules);

        List<TeacherScheduleDTO> teacherSchedules = new ArrayList<>();
        for(TeacherSchedule teacherSchedule : teacherScheduleRepository.findByTeacherAndTeacherScheduleDate(teacher,date)){
            teacherSchedules.add(teacherScheduleMapper.toDTO(teacherSchedule));
        }
        schedules.setTeacherSchedules(teacherSchedules);

        return schedules;
    }
    public List<KindergartenScheduleDTO> getParentSchedules(String userName) {
        List<KindergartenScheduleDTO> schedules = new ArrayList<>();
        Parent parent = parentRepository.findByParentUsername(userName);

        for(Schedule schedule: scheduleRepository.findByKindergarten(parent.getChildren().stream().findFirst().get().getKindergartenClass().getKindergarten())){
            schedules.add(scheduleMapper.toDTO(schedule));
        }

        return schedules;
    }

    public void addSchedule(String teacherUserName, ScheduleDTO scheduleDTO) {
        Teacher teacher = teacherRepository.findByTeacherUsername(teacherUserName);
        TeacherSchedule teacherSchedule = new TeacherSchedule();
        teacherSchedule.setTeacher(teacher);
        teacherSchedule.setTeacherScheduleDate(scheduleDTO.getDate());
        teacherSchedule.setTeacherScheduleContents(scheduleDTO.getContent());
        teacherScheduleRepository.save(teacherSchedule);
    }
}
