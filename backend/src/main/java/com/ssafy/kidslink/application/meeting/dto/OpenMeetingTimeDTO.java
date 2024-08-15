package com.ssafy.kidslink.application.meeting.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class OpenMeetingTimeDTO {
    private String date;
    private List<String> times;
}
