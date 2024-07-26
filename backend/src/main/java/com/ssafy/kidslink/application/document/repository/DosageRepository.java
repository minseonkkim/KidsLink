package com.ssafy.kidslink.application.document.repository;


import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.document.domain.Dosage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DosageRepository extends JpaRepository<Dosage,Integer> {
    List<Dosage> findByChildChildId(int childId);
    @Query("SELECT a FROM Dosage a WHERE a.child = :child AND :date BETWEEN a.dosageStartdate AND a.dosageEnddate")
    List<Dosage> findByChildAndDateBetween(@Param("child") Child child, @Param("date") LocalDate date);
    List<Dosage> findByChild(Child child);
}
