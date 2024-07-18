package com.ssafy.kidslink.application.dosage.domain;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.common.enums.ConfirmationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "dosage")
public class Dosage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dosage_id")
    private Integer dosageId;

    @Column(name = "dosage_startdate")
    private LocalDate dosageStartdate;

    @Column(name = "dosage_enddate")
    private LocalDate dosageEnddate;

    @Column(name = "dosage_volume")
    private String dosageVolume;

    @Column(name = "dosage_num")
    private String dosageNum;

    @Column(name = "dosage_time")
    private String dosageTime;

    @Column(name = "dosage_store")
    private String dosageStore;

    @Column(name = "dosage_details")
    private String dosageDetails;

    @Column(name = "confirmation_status")
    @Enumerated(EnumType.STRING)
    private ConfirmationStatus confirmationStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;
}