package com.ssafy.kidslink.application.image.repository;

import com.ssafy.kidslink.application.image.domain.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface ImageRepository extends JpaRepository<Image, Integer> {
}
