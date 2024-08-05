package com.ssafy.kidslink.application.bus.domain;

import com.ssafy.kidslink.application.bus.domain.Bus;
import com.ssafy.kidslink.application.child.domain.Child;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "bus_stop")
public class BusStop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bus_stop_id")
    private int busStopId;

    @Column(length = 100, name = "bus_stop_name")
    private String busStopName;

    @ManyToOne
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @Transient
    private int stopOrder; // 엔티티에만 존재하며 DB에는 없는 필드

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_stop_id")
    private List<Child> children = new ArrayList<>();
}