package com.ssafy.kidslink.application.bus.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class BusStopDTO {
    int busId;
    int busStopId;
    String busStopName;
    List<BusStopChildDTO> children;
}
