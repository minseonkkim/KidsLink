package com.ssafy.kidslink.application.bus.dto;

import com.ssafy.kidslink.common.enums.BoardingStatus;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BusStopChildDTO {
    private String childName;
    private String parentTel;
    private BoardingStatus status;
}
