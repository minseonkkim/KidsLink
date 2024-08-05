package com.ssafy.kidslink.application.bus.repository;

import com.ssafy.kidslink.application.bus.domain.BusStopChild;
import com.ssafy.kidslink.application.bus.domain.BusStopChildId;
import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.common.enums.BoardingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface BusStopChildRepository extends JpaRepository<BusStopChild, BusStopChildId> {
    @Query("SELECT bsc FROM BusStopChild bsc WHERE bsc.busStop.busStopId = :busStopId")
    List<BusStopChild> findByBusStopId(@Param("busStopId") int busStopId);

    @Transactional
    @Modifying
    @Query("UPDATE BusStopChild bsc SET bsc.busBoardingStatus = :status WHERE bsc.child.childId = :childId")
    void updateBoardingStatus(@Param("childId") int childId, @Param("status") BoardingStatus status);

    BusStopChild findByChild(Child child);
}
