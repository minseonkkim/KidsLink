package com.ssafy.kidslink.application.bus.domain;

import com.ssafy.kidslink.application.busstop.domain.BusStop;
import com.ssafy.kidslink.application.kindergarten.domain.Kindergarten;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Getter
@Setter
public class Bus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bus_id")
    private int busId;

    @Column(name = "bus_name", nullable = false, length = 50)
    private String busName;

    @OneToOne
    @JoinColumn(name = "kindergarten_id", nullable = false)
    private Kindergarten kindergarten;

    @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL)
    private Set<BusStop> busStops;
}
