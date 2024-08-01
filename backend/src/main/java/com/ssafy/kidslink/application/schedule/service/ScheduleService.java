package com.ssafy.kidslink.application.schedule.service;

import com.ssafy.kidslink.application.document.domain.Absent;
import com.ssafy.kidslink.application.document.domain.Dosage;
import com.ssafy.kidslink.application.document.dto.AbsentDTO;
import com.ssafy.kidslink.application.document.dto.DosageDTO;
import com.ssafy.kidslink.application.document.mapper.AbsentMapper;
import com.ssafy.kidslink.application.document.mapper.DosageMapper;
import com.ssafy.kidslink.application.document.repository.AbsentRepository;
import com.ssafy.kidslink.application.document.repository.DosageRepository;
import com.ssafy.kidslink.application.meeting.domain.MeetingSchedule;
import com.ssafy.kidslink.application.meeting.dto.MeetingScheduleDTO;
import com.ssafy.kidslink.application.meeting.mapper.MeetingScheduleMapper;
import com.ssafy.kidslink.application.meeting.repository.MeetingScheduleRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.schedule.domain.Schedule;
import com.ssafy.kidslink.application.schedule.domain.TeacherSchedule;
import com.ssafy.kidslink.application.schedule.dto.AllParentScheduleDTO;
import com.ssafy.kidslink.application.schedule.dto.AllTeacherScheduleDTO;
import com.ssafy.kidslink.application.schedule.dto.KindergartenScheduleDTO;
import com.ssafy.kidslink.application.schedule.dto.TeacherScheduleDTO;
import com.ssafy.kidslink.application.schedule.mapper.ScheduleMapper;
import com.ssafy.kidslink.application.schedule.mapper.TeacherScheduleMapper;
import com.ssafy.kidslink.application.schedule.repository.ScheduleRepository;
import com.ssafy.kidslink.application.schedule.repository.TeacherScheduleRepository;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import com.ssafy.kidslink.common.enums.ConfirmationStatus;
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
    private final MeetingScheduleRepository meetingScheduleRepository;
    private final AbsentRepository absentRepository;
    private final DosageRepository dosageRepository;


    private final ScheduleMapper scheduleMapper;
    private final MeetingScheduleMapper meetingScheduleMapper;
    private final TeacherScheduleMapper teacherScheduleMapper;
    private final DosageMapper dosageMapper;
    private final AbsentMapper absentMapper;

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

    public List<LocalDate> getParentSchedules(String userName, int year, int month){
        Parent parent = parentRepository.findByParentUsername(userName);
        List<LocalDate> parentSchedules = new ArrayList<>();
        for(LocalDate date : scheduleRepository.findScheduleDatesByKindergartenAndYearAndMonth(
                parent.getChildren().iterator().next().getKindergartenClass().getKindergarten(),year,month)){
            parentSchedules.add(date);
        }
        for(LocalDate date : meetingScheduleRepository.findScheduleDatesByParentAndYearAndMonth(parent,year,month)){
            parentSchedules.add(date);
        }
        return parentSchedules;

    }

    public AllParentScheduleDTO getParentDetailSchedules(String userName, LocalDate date) {
        Parent parent = parentRepository.findByParentUsername(userName);

        AllParentScheduleDTO schedules = new AllParentScheduleDTO();
        schedules.setDate(date);

        List<KindergartenScheduleDTO> kindergartenSchedules = new ArrayList<>();
        for(Schedule schedule : scheduleRepository.findByKindergartenAndScheduleDate(parent.getChildren().stream().findFirst().get()
                .getKindergartenClass().getKindergarten(), date)){
            kindergartenSchedules.add(scheduleMapper.toDTO(schedule));
        }
        schedules.setKindergartenSchedules(kindergartenSchedules);

        List<MeetingScheduleDTO> meetingSchedules = new ArrayList<>();
        for(MeetingSchedule meetingSchedule : meetingScheduleRepository.findByParentAndMeetingScheduleDate(parent,date)){
            meetingSchedules.add(meetingScheduleMapper.toDTO(meetingSchedule));
        }
        schedules.setMeetingSchedules(meetingSchedules);

        List<AbsentDTO> absentDTOs = new ArrayList<>();
        for(Absent absent : absentRepository.findByChildAndDateBetween(parent.getChildren().iterator().next(), date)){
            absentDTOs.add(absentMapper.toDTO(absent));
        }
        schedules.setAbsentSchedules(absentDTOs);

        List<DosageDTO> dosageDTOs = new ArrayList<>();
        for(Dosage dosage : dosageRepository.findByChildAndDateBetween(parent.getChildren().iterator().next(), date)){
            dosageDTOs.add(dosageMapper.toDTO(dosage));
        }
        schedules.setDosageSchedules(dosageDTOs);

        return schedules;
    }

    public void addSchedule(String teacherUserName, TeacherScheduleDTO scheduleDTO) {
        Teacher teacher = teacherRepository.findByTeacherUsername(teacherUserName);
        TeacherSchedule teacherSchedule = new TeacherSchedule();
        teacherSchedule.setTeacher(teacher);
        teacherSchedule.setTeacherScheduleDate(scheduleDTO.getDate());
        teacherSchedule.setTeacherScheduleContents(scheduleDTO.getContent());
        teacherSchedule.setConfirmationStatus(ConfirmationStatus.F);
        teacherScheduleRepository.save(teacherSchedule);
    }
}
