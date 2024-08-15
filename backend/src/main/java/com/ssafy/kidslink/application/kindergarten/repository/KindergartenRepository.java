package com.ssafy.kidslink.application.kindergarten.repository;

import com.ssafy.kidslink.application.kindergarten.domain.Kindergarten;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KindergartenRepository extends JpaRepository<Kindergarten, Integer> {
    Kindergarten findByKindergartenName(String kindergartenName);
}
