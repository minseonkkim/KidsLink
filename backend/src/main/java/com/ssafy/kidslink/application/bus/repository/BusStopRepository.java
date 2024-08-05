package com.ssafy.kidslink.application.bus.repository;

import com.ssafy.kidslink.application.bus.domain.BusStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusStopRepository extends JpaRepository<BusStop, Integer> {
}
