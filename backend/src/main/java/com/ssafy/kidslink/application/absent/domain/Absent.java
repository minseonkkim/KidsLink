package com.ssafy.kidslink.application.absent.domain;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.common.enums.ConfirmationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "absent")
public class Absent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "absent_id")
    private Integer absentId;

    @Column(name = "absent_startdate")
    private LocalDate absentStartdate;

    @Column(name = "absent_enddate")
    private LocalDate absentEnddate;

    @Column(name = "absent_reason")
    private String absentReason;

    @Column(name = "absent_details")
    private String absentDetails;

    @Column(name = "confirmation_status")
    @Enumerated(EnumType.STRING)
    private ConfirmationStatus confirmationStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;
}