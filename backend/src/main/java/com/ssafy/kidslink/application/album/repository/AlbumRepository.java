package com.ssafy.kidslink.application.album.repository;

import com.ssafy.kidslink.application.album.domain.Album;
import com.ssafy.kidslink.application.child.domain.Child;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Integer> {
    List<Album> findByChild(Child child);
}
