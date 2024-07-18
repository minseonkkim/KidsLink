package com.ssafy.kidslink.application.busstopchild.domain;

import java.io.Serializable;
import java.util.Objects;

public class BusStopChildId implements Serializable {

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