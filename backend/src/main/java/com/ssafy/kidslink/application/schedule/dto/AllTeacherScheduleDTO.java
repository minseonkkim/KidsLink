package com.ssafy.kidslink.application.schedule.dto;

import com.ssafy.kidslink.application.meetingschedule.dto.MeetingScheduleDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@ToString
public class AllTeacherScheduleDTO {
    LocalDate date;
    List<KindergartenScheduleDTO> kindergartenSchedules;
    List<TeacherScheduleDTO> teacherSchedules;
    List<MeetingScheduleDTO> meetingSchedules;
}
