package com.ssafy.kidslink.application.kindergarten.domain;

import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
import com.ssafy.kidslink.application.schedule.domain.Schedule;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "kindergarten")
public class Kindergarten {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer kindergartenId;

    private String kindergartenName;

    @OneToMany(mappedBy = "kindergarten")
    private List<KindergartenClass> kindergartenClasses;

    @OneToMany(mappedBy = "kindergarten")
    private List<Schedule> schedules;

}
