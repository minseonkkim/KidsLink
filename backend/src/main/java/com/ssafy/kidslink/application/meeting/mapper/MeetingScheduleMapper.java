package com.ssafy.kidslink.application.meeting.mapper;

import com.ssafy.kidslink.application.meeting.domain.MeetingSchedule;
import com.ssafy.kidslink.application.meeting.dto.MeetingScheduleDTO;
import org.springframework.stereotype.Component;

@Component
public class MeetingScheduleMapper {
    public MeetingScheduleDTO toDTO(MeetingSchedule meetingSchedule) {
        MeetingScheduleDTO meetingScheduleDTO = new MeetingScheduleDTO();
        meetingScheduleDTO.setMeetingDate(meetingSchedule.getMeetingScheduleDate());
        meetingScheduleDTO.setMeetingTime(meetingSchedule.getMeetingScheduleTime());
        meetingScheduleDTO.setMeetingId(meetingSchedule.getMeetingScheduleId());
        meetingScheduleDTO.setParentId(meetingSchedule.getParent().getParentId());
        meetingScheduleDTO.setTeacherId(meetingSchedule.getTeacher().getTeacherId());
        return meetingScheduleDTO;
    }
}
