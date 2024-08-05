package com.ssafy.kidslink.application.busstopchild.domain;

import com.ssafy.kidslink.application.busstop.domain.BusStop;
import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.common.enums.BoardingStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

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

class BusStopChildId implements Serializable {

    private Integer child;
    private Integer busStop;

    public BusStopChildId() {}

    public BusStopChildId(Integer child, Integer busStop) {
        this.child = child;
        this.busStop = busStop;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BusStopChildId that = (BusStopChildId) o;
        return Objects.equals(child, that.child) && Objects.equals(busStop, that.busStop);
    }

    @Override
    public int hashCode() {
        return Objects.hash(child, busStop);
    }
}