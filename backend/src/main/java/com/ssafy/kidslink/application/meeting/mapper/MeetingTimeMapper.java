package com.ssafy.kidslink.application.meetingtime.mapper;

import com.ssafy.kidslink.application.meetingtime.domain.MeetingTime;
import com.ssafy.kidslink.application.meetingtime.dto.MeetingTimeDTO;
import org.springframework.stereotype.Component;

@Component
public class MeetingTimeMapper {
    public MeetingTimeDTO toDTO(MeetingTime meetingTime) {
        MeetingTimeDTO dto = new MeetingTimeDTO();
        dto.setMeetingId(meetingTime.getMeetingTimeId());
        dto.setDate(meetingTime.getMeetingDate());
        dto.setTime(meetingTime.getMeetingTime());
        return dto;
    }
}
