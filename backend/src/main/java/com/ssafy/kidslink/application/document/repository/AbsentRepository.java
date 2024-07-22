package com.ssafy.kidslink.application.document.repository;

import com.ssafy.kidslink.application.document.domain.Absent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AbsentRepository extends JpaRepository<Absent, Integer> {
    List<Absent> findByAbsentId(int childId);
}
