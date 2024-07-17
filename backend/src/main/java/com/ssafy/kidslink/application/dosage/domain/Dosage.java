package com.ssafy.kidslink.application.dosage.domain;

import com.ssafy.kidslink.application.child.domain.Child;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Dosage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer dosageId;

    private LocalDate dosageStartdate;
    private LocalDate dosageEnddate;
    private String dosageVolume;
    private String dosageNum;
    private String dosageTime;
    private String dosageStore;
    private String dosageDetails;
    private String confirmationStatus;

    @ManyToOne
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;
}