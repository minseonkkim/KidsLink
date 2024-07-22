package com.ssafy.kidslink.application.busstopchild.dto;

import com.ssafy.kidslink.application.busstopchild.domain.BusStopChild;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BusStopChildDTO {
    private String childName;
    private String parentTel;
    private BusStopChild.BoardingStatus status;
}