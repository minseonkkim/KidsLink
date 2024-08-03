package com.ssafy.kidslink.application.imagealbum.repository;

import com.ssafy.kidslink.application.imagealbum.domain.ImageAlbum;
import com.ssafy.kidslink.application.imagealbum.domain.ImageAlbumId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageAlbumRepository extends JpaRepository<ImageAlbum, ImageAlbumId> {
}
