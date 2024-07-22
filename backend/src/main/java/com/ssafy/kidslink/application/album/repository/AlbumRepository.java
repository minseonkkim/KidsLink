package com.ssafy.kidslink.application.album.repository;

import com.ssafy.kidslink.application.album.domain.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Integer> {
}
