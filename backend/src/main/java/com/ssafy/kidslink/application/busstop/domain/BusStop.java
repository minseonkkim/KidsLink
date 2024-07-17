package com.ssafy.kidslink.application.busstop.domain;

import com.ssafy.kidslink.application.busstopchild.domain.BusStopChild;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class BusStop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer busStopId;

    private String busStopName;

    @OneToMany(mappedBy = "busStop")
    private List<BusStopChild> busStopChildren;

}