package com.ssafy.kidslink.application.bus.dto;

import com.ssafy.kidslink.application.busstopchild.dto.BusStopChildDTO;
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
