package com.ssafy.kidslink.application.busstopchild.domain;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
public class BusStopChildId implements Serializable {

    private Integer child;
    private Integer busStop;

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