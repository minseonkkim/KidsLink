package com.ssafy.kidslink.application.imagealbum.domain;

import com.ssafy.kidslink.application.album.domain.Album;
import com.ssafy.kidslink.application.image.domain.Image;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "image_album")
@IdClass(ImageAlbumId.class)
public class ImageAlbum {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "image_id", nullable = false)
    private Image image;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;
}

