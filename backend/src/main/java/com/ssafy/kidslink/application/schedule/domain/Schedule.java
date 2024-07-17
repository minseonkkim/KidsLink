package com.ssafy.kidslink.application.schedule.domain;

import com.ssafy.kidslink.application.kindergarten.domain.Kindergarten;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer scheduleId;

    private LocalDate scheduleDate;

    private String scheduleName;

    @ManyToOne
    @JoinColumn(name = "kindergarten_id", nullable = false)
    private Kindergarten kindergarten;

    // Getters and Setters
}