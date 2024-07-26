package com.ssafy.kidslink.application.document.repository;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.document.domain.Absent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AbsentRepository extends JpaRepository<Absent, Integer> {
    List<Absent> findByChildChildId(int childId);
    @Query("SELECT a FROM Absent a WHERE a.child = :child AND :date BETWEEN a.absentStartdate AND a.absentEnddate")
    List<Absent> findByChildAndDateBetween(@Param("child") Child child, @Param("date") LocalDate date);
}
