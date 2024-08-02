package com.ssafy.kidslink.application.busstopchild.repository;

import com.ssafy.kidslink.application.busstopchild.domain.BusStopChild;
import com.ssafy.kidslink.application.child.domain.Child;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface BusStopChildRepository extends JpaRepository<BusStopChild, Integer> {
    @Query("SELECT bsc FROM BusStopChild bsc WHERE bsc.busStop.busStopId = :busStopId")
    List<BusStopChild> findByBusStopId(@Param("busStopId") int busStopId);

    @Transactional
    @Modifying
    @Query("UPDATE BusStopChild bsc SET bsc.busBoardingStatus = :status WHERE bsc.child.childId = :childId")
    void updateBoardingStatus(@Param("childId") int childId, @Param("status") BusStopChild.BoardingStatus status);

    List<BusStopChild> findByChild(Child child);
}
