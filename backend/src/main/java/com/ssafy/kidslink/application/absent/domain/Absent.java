package com.ssafy.kidslink.application.absent.domain;

import com.ssafy.kidslink.application.child.domain.Child;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Absent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer absentId;

    private LocalDate absentStartdate;
    private LocalDate absentEnddate;
    private String absentReason;
    private String absentDetails;
    private String confirmationStatus;

    @ManyToOne
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    // Getters and Setters
}