package com.ssafy.kidslink.application.imagealbum.domain;

import java.io.Serializable;
import java.util.Objects;

public class ImageAlbumId implements Serializable {

    private Integer image;
    private Integer album;

    public ImageAlbumId() {}

    public ImageAlbumId(Integer image, Integer album) {
        this.image = image;
        this.album = album;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ImageAlbumId that = (ImageAlbumId) o;
        return Objects.equals(image, that.image) && Objects.equals(album, that.album);
    }

    @Override
    public int hashCode() {
        return Objects.hash(image, album);
    }
}