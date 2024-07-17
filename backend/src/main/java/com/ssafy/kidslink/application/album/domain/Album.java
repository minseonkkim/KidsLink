package com.ssafy.kidslink.application.album.domain;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.imagealbum.domain.ImageAlbum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Album {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer albumId;

    private String albumName;

    @ManyToOne
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    @OneToMany(mappedBy = "album")
    private List<ImageAlbum> imageAlbums;

    // Getters and Setters
}