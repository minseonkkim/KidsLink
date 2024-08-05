package com.ssafy.kidslink.application.busstop.domain;

import com.ssafy.kidslink.application.bus.domain.Bus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
}