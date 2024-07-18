package com.ssafy.kidslink.application.kindergarten.domain;

import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
import com.ssafy.kidslink.application.schedule.domain.Schedule;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "kindergarten")
public class Kindergarten {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "kindergarten_id")
    private Integer kindergartenId;

    @Column(name = "kindergarten_name")
    private String kindergartenName;

    @OneToMany(mappedBy = "kindergarten", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<KindergartenClass> kindergartenClasses;

}
