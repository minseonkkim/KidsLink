package com.ssafy.kidslink.application.schedule.dto;

import com.ssafy.kidslink.application.document.dto.AbsentDTO;
import com.ssafy.kidslink.application.document.dto.DosageDTO;
import com.ssafy.kidslink.application.meetingschedule.dto.MeetingScheduleDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@ToString
public class AllParentScheduleDTO {
    LocalDate date;
    List<KindergartenScheduleDTO> kindergartenSchedules;
    List<MeetingScheduleDTO> meetingSchedules;
    List<AbsentDTO> absentSchedules;
    List<DosageDTO> dosageSchedules;
}
