package com.ssafy.kidslink.application.diary.domain;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.image.domain.Image;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "diary")
public class Diary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diary_id")
    private Integer diaryId;

    @Column(name = "diary_date")
    private LocalDate diaryDate;

    @Column(name = "diary_contents")
    private String diaryContents;

    @Column(name = "diary_thumbnail")
    private String diaryThumbnail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    @ManyToMany
    @JoinTable(
            name = "image_diary",
            joinColumns = @JoinColumn(name = "diary_id"),
            inverseJoinColumns = @JoinColumn(name = "image_id")
    )
    private Set<Image> images = new HashSet<>();
}