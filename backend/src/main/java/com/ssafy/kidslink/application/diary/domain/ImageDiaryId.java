package com.ssafy.kidslink.application.diary.domain;

import java.io.Serializable;
import java.util.Objects;

public class ImageDiaryId implements Serializable {

    private int diary;
    private int image;

    public ImageDiaryId() {}

    public ImageDiaryId(int diary, int image) {
        this.diary = diary;
        this.image = image;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ImageDiaryId that = (ImageDiaryId) o;
        return Objects.equals(diary, that.diary) &&
                Objects.equals(image, that.image);
    }

    @Override
    public int hashCode() {
        return Objects.hash(diary, image);
    }
}