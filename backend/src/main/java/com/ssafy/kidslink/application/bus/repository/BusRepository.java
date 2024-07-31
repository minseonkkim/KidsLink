package com.ssafy.kidslink.application.bus.repository;

import com.ssafy.kidslink.application.bus.domain.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BusRepository extends JpaRepository<Bus, Long> {
    Optional<Bus> findTopByOrderByTimestampDesc();
}