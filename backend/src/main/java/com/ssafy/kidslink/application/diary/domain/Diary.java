package com.ssafy.kidslink.application.diary.domain;

import com.ssafy.kidslink.application.child.domain.Child;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Diary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer diaryId;

    private LocalDate diaryDate;

    private String diaryContents;

    @ManyToOne
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    // Getters and Setters
}