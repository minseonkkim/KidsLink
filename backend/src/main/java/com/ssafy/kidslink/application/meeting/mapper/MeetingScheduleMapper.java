package com.ssafy.kidslink.application.meeting.mapper;

import com.ssafy.kidslink.application.meeting.domain.MeetingSchedule;
import com.ssafy.kidslink.application.meeting.dto.MeetingRoomDTO;
import com.ssafy.kidslink.application.meeting.dto.MeetingScheduleDTO;
import com.ssafy.kidslink.application.meeting.dto.SelectedMeetingDTO;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
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
    public MeetingSchedule toEntity(SelectedMeetingDTO selectedMeetingDTO,Teacher teacher,Parent parent) {
        MeetingSchedule meetingSchedule = new MeetingSchedule();
        meetingSchedule.setMeetingScheduleDate(selectedMeetingDTO.getDate());
        meetingSchedule.setMeetingScheduleTime(selectedMeetingDTO.getTime());

        meetingSchedule.setParent(parent);
        meetingSchedule.setTeacher(teacher);

        return meetingSchedule;
    }

    public MeetingRoomDTO toMeetingRoomDTO(MeetingSchedule meetingSchedule) {
        MeetingRoomDTO meetingRoomDTO = new MeetingRoomDTO();
        meetingRoomDTO.setId(meetingSchedule.getMeetingScheduleId());
        meetingRoomDTO.setTime(meetingSchedule.getMeetingScheduleTime());
        meetingRoomDTO.setDate(meetingSchedule.getMeetingScheduleDate());
        meetingRoomDTO.setParentId(meetingSchedule.getParent().getParentId());
        meetingRoomDTO.setChildName(meetingSchedule.getParent().getChildren().iterator().next().getChildName());
        meetingRoomDTO.setTeacherId(meetingSchedule.getTeacher().getTeacherId());
        meetingRoomDTO.setTeacherName(meetingSchedule.getTeacher().getTeacherName());
        return meetingRoomDTO;
    }
}
