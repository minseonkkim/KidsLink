package com.ssafy.kidslink.application.busstopchild.domain;

import com.ssafy.kidslink.application.busstop.domain.BusStop;
import com.ssafy.kidslink.application.child.domain.Child;
import jakarta.persistence.*;
import lombok.*;

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

    public enum BoardingStatus {
        T, F
    }
}