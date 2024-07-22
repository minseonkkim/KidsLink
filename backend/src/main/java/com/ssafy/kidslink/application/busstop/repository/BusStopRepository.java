package com.ssafy.kidslink.application.busstop.repository;

import com.ssafy.kidslink.application.busstop.domain.BusStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusStopRepository extends JpaRepository<BusStop, Integer> {
}
