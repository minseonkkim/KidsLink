package com.ssafy.kidslink.application.imagealbum.domain;

import com.ssafy.kidslink.application.album.domain.Album;
import com.ssafy.kidslink.application.image.domain.Image;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ImageAlbum {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer imageAlbumId;

    @ManyToOne
    @JoinColumn(name = "image_id", nullable = false)
    private Image image;

    @ManyToOne
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;
}