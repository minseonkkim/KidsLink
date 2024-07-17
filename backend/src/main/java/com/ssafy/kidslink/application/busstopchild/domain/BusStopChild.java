package com.ssafy.kidslink.application.busstopchild.domain;

import com.ssafy.kidslink.application.busstop.domain.BusStop;
import com.ssafy.kidslink.application.child.domain.Child;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Getter
@Setter
public class BusStopChild {
    @EmbeddedId
    private BusStopChildId id;

    @ManyToOne
    @MapsId("childId")
    @JoinColumn(name = "child_id")
    private Child child;

    @ManyToOne
    @MapsId("busStopId")
    @JoinColumn(name = "bus_stop_id")
    private BusStop busStop;

    private String busBoardingStatus;
}

@Embeddable
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
class BusStopChildId implements Serializable {
    private Integer childId;
    private Integer busStopId;
}