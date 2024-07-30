package com.ssafy.kidslink.application.meeting.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class MeetingRoomDTO {
    private int id;
    private LocalDate date;
    private String time;
    private int teahcerId;
    private String teacherName;
    private int parentId;
    private String childName;
}