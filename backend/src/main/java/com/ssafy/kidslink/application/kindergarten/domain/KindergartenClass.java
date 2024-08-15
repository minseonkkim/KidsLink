package com.ssafy.kidslink.application.kindergarten.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "kindergarten_class")
public class KindergartenClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "kindergarten_class_id")
    private Integer kindergartenClassId;

    @Column(name = "kindergarten_id")
    private Integer kindergartenId;

    @Column(name = "kindergarten_class_name")
    private String kindergartenClassName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kindergarten_id", insertable = false, updatable = false)
    private Kindergarten kindergarten;
}
