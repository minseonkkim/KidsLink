package com.ssafy.kidslink.application.diary.domain;

import com.ssafy.kidslink.application.image.domain.Image;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Entity
@IdClass(ImageDiaryId.class)
@Getter
@Setter
@Table(name = "image_diary")
public class ImageDiary implements Serializable {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id", nullable = false)
    private Diary diary;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "image_id", nullable = false)
    private Image image;
}