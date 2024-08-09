package com.ssafy.kidslink.application.meeting.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AllocatedMeetingDTO {
    private SelectedMeetingDTO selectedMeetingDTO;
    private String parentUsername;
}
