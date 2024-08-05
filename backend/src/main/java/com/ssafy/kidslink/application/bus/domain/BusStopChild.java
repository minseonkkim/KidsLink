package com.ssafy.kidslink.application.bus.domain;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.common.enums.BoardingStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "bus_stop_child")
@IdClass(BusStopChildId.class)
public class BusStopChild {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_stop_id", nullable = false)
    private BusStop busStop;

    @Column(name = "bus_boarding_status")
    @Enumerated(EnumType.STRING)
    private BoardingStatus busBoardingStatus;
}