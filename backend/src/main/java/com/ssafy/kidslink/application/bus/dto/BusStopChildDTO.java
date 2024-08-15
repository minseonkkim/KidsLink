package com.ssafy.kidslink.application.bus.dto;

import com.ssafy.kidslink.application.child.dto.ChildDTO;
import com.ssafy.kidslink.common.enums.BoardingStatus;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BusStopChildDTO {
    private ChildDTO child;
    private String parentTel;
    private BoardingStatus status;
}
